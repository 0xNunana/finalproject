"use client";

import StudentIdCard from "@/components/StudentID";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/context/useUser";
import {
  ArrowDownTrayIcon,
  ClipboardIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  PrinterIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query"; // Import React Query hooks
import Image from "next/image";
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
const MyIDHome = () => {
  const { user } = useUser();
  const queryClient = new QueryClient();

  // Use React Query to fetch the card
  const {
    data: card,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["card"], // Unique identifier for the query
    queryFn: async () => {
      const response = await fetch("/api/cards/myCard");
      const data = await response.json();
      return data.card;
    },
  });

  // Handle form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null); // Ref to the StudentIdCard container

  const [formData, setFormData] = useState({
    year: "",
    program: "",
    gender: "",
    image: null as File | null, // Ensure this matches the image state
  });
  const [isDialog2Open, setIsDialog2Open] = useState(false); // For the edit modal
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    year: "",
    program: "",
    gender: "",
    image: null as File | null,
  });
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  // Use Mutation for creating a card
  const createCardMutation = useMutation({
    mutationFn: async (formDataWithImage: {
      year: string;
      program: string;
      gender: string;
      image: File | null;
    }) => {
      // Use FormData to send the image (critical fix!)
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", `${user?.firstName} ${user?.lastName}`);
      formDataToSend.append("year", formDataWithImage.year);
      formDataToSend.append("program", formDataWithImage.program);
      formDataToSend.append("gender", formDataWithImage.gender);
      if (formDataWithImage.image) {
        formDataToSend.append("image", formDataWithImage.image);
      }

      const response = await fetch("/api/cards/create", {
        method: "POST",
        body: formDataToSend,
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the query to refetch data after mutation
      queryClient.invalidateQueries({ queryKey: ["card"] });
      refetch();
    },
  });

  // Mutation for updating the card
  const updateCardMutation = useMutation({
    mutationFn: async (formDataWithImage: {
      id: string;
      year: string;
      program: string;
      gender: string;
      image: File | null;
    }) => {
      const formDataToSend = new FormData();
      formDataToSend.append("id", formDataWithImage.id);
      formDataToSend.append("year", formDataWithImage.year);
      formDataToSend.append("program", formDataWithImage.program);
      formDataToSend.append("gender", formDataWithImage.gender);
      if (formDataWithImage.image) {
        formDataToSend.append("image", formDataWithImage.image);
      }

      const response = await fetch("/api/cards/update", {
        method: "PUT",
        body: formDataToSend,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card"] });
      refetch();
    },
  });

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      image: prev.image, // Preserve image state
    }));
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      // Update formData's image (critical fix!)
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleEdit = () => {
    if (card) {
      setEditFormData({
        ...card,
        fullName: `${user?.firstName} ${user?.lastName}`,
        year: card.year,
        program: card.program,
        gender: card.gender,
        image: null, // Reset to null (user can choose to replace the image)
      });
      setEditImagePreview(card.image); // Show existing image as preview
      setIsDialog2Open(true);
    }
  };

  const handleShareImage = async () => {
    if (!cardRef.current || !card) return;

    try {
      const canvas = await html2canvas(cardRef.current);
      const imageDataURL = canvas.toDataURL("image/png");

      if (navigator.share) {
        const blob = await fetch(imageDataURL).then((res) => res.blob());
        // Create a File object from the Blob
        const file = new File([blob], `${card.fullName}_id_card.png`, {
          type: "image/png",
        });

        await navigator.share({
          title: `${card.fullName}'s ID Card`,
          files: [file], // Now passing a File object
        });
        console.log("Shared successfully");
      } else {
        // Fallback for download
        const link = document.createElement("a");
        link.href = imageDataURL;
        link.download = `${card.fullName}_id_card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error sharing as image:", error);
      // Optionally provide user feedback
    }
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: `Check out ${card?.fullName}'s Profile`,
          url: `${window.location.origin}/dasboard/${user?.id}`,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
        // Optionally provide feedback to the user about the failure
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(
        `${window.location.origin}/dasboard/${user?.id}`
      );
      alert("Profile link copied to clipboard!"); // Simple feedback
    }
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;

    updateCardMutation.mutate({
      id: card.id, // Ensure your card has an `id` field
      year: editFormData.year,
      program: editFormData.program,
      gender: editFormData.gender,
      image: editFormData.image,
    });

    setIsDialog2Open(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCardMutation.mutate({
      year: formData.year,
      program: formData.program,
      gender: formData.gender,
      image: formData.image,
    });
    setIsDialogOpen(false);
  };

  // UI Rendering
  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <h2 className="text-center text-white text-xl font-semibold">
          Loading...
        </h2>
        <p className="w-1/3 text-center text-white">
          This may take a few seconds, please don't close this page.
        </p>
      </div>
    );
  }
  if (isError) return <div>Error fetching card data.</div>;

  return (
    <div className="">
      {card ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold text-gray-800">
              My Digital ID
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PencilSquareIcon className="h-5 w-5 mr-2" />
                Edit
              </button>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                    <ShareIcon className="h-5 w-5 mr-2" />
                    Share
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[150px] space-y-2">
                  <button
                    className="flex hover:text-blue-500"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/dashboard/${user?.id}`
                      );
                      alert("Profile link copied to clipboard!");
                    }}
                  >
                    <ClipboardIcon className="h-5 w-5 mr-2" />
                    Copy Link
                  </button>
                  <button
                    onClick={handleShareImage}
                    className="flex hover:text-blue-500"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Dowload
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-center ">
            <StudentIdCard
              ref={cardRef}
              key={card.id}
              gender={card.gender}
              studentImage={card.imagelink}
              studentName={card.fullName}
              year={card.year}
              program={card.program}
              profileLink={
                card.profilelink ||
                `${window.location.origin}/dashboard/${card.id}`
              }
            />
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            No ID Card Found
          </h2>
          <p className="text-gray-600 mb-3">
            Looks like you haven't created your digital ID card yet.
          </p>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create ID Card
          </button>
        </div>
      )}

      {/* Dialog for creating a card */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Create Your Digital ID
              </h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  id="image"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {imagePreview && (
                  <div className="mt-2 flex justify-center items-center">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={60}
                      height={60}
                      className="rounded"
                    />
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700"
                >
                  Year
                </label>
                <input
                  type="text"
                  name="year"
                  id="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="program"
                  className="block text-sm font-medium text-gray-700"
                >
                  Program
                </label>
                <input
                  type="text"
                  name="program"
                  id="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCardMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {createCardMutation.isPending ? "Creating..." : "Create Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDialog2Open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit ID Card</h2>
            <form onSubmit={(e) => handleEditSubmit(e)}>
              <div className="mb-4">
                {editImagePreview && (
                  <div className="flex justify-center">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-24 h-24 mt-2 rounded"
                    />
                  </div>
                )}
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditFormData({ ...editFormData, image: file });
                      setEditImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={editFormData.fullName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      fullName: e.target.value,
                    })
                  }
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={editFormData.gender}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      gender: e.target.value,
                    })
                  }
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Program
                </label>
                <input
                  type="text"
                  name="program"
                  value={editFormData.program}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      program: e.target.value,
                    })
                  }
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="text"
                  name="year"
                  value={editFormData.year}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, year: e.target.value })
                  }
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDialog2Open(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={updateCardMutation.isPending}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIDHome;
