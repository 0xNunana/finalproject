// "use client";

// import StudentIdCard from "@/components/StudentID";
// import { useUser } from "@/context/useUser";
// import React, { useEffect, useState } from "react";

// const MyIDHome = () => {
//   const [card, setCard] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [image, setImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const { user } = useUser();
//   const [formData, setFormData] = useState({
//     year: "",
//     program: "",
//     gender: "",
//     image: null as File | null,
//   });

//   useEffect(() => {
//     const fetchCard = async () => {
//       const response = await fetch("/api/cards/myCard");
//       const data = await response.json();
//       if (data.card) {
//         setCard(data.card);
//       }
//       setLoading(false);
//     };

//     fetchCard();
//   }, []);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //     const files = e.target.files;
//   //     if (files && files.length > 0) {
//   //       setFormData((prev) => ({ ...prev, image: files[0] })); // Set the first file
//   //     }
//   //   };
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       // Create preview URL
//       const previewUrl = URL.createObjectURL(file);
//       setImagePreview(previewUrl);
//     }
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     // Upload image to Cloudinary

//     const cardData = {
//       fullName: `${user?.firstName} ${user?.lastName}`,
//       year: formData.year,
//       program: formData.program,
//       gender: formData.gender,
//       image: formData.image,
//     };

//     const response = await fetch("/api/cards/create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(cardData),
//     });

//     if (response.ok) {
//       const newCard = await response.json();
//       setCard(newCard);
//       setIsDialogOpen(false);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="">
//       {card ? (
//         <div>
//           <div>
//             <h2 className="text-2xl flex justify-between font-bold mb-4 p-3 bg-white">
//               <div>My Card</div>
//               <div>Share</div>
//             </h2>
//           </div>
//           <div className="flex justify-center items-center mt-10">
//             <StudentIdCard
//               studentImage={card.image}
//               studentName={card.fullName}
//               year={card.year}
//               program={card.program}
//               profileLink=""
//             />
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white p-4 rounded shadow-md w-1/2 text-center">
//           <h2 className="text-xl font-bold">No ID Card Found</h2>
//           <p>You don't have an ID card yet. Please create one.</p>
//           <button
//             onClick={() => setIsDialogOpen(true)}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Create ID Card
//           </button>
//         </div>
//       )}

//       {/* Dialog for Creating ID Card */}
//       {isDialogOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded shadow-md w-1/3">
//             <h2 className="text-xl font-bold mb-4">Create ID Card</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Year
//                 </label>
//                 <input
//                   type="text"
//                   name="year"
//                   value={formData.year}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Program
//                 </label>
//                 <input
//                   type="text"
//                   name="program"
//                   value={formData.program}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Gender
//                 </label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleInputChange}
//                   required
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Upload Image
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   required
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setIsDialogOpen(false)}
//                   className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   Create Card
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyIDHome;

"use client";

import StudentIdCard from "@/components/StudentID";
import { useUser } from "@/context/useUser";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query"; // Import React Query hooks
import React, { useState } from "react";

const MyIDHome = () => {
  const { user } = useUser();
  const queryClient = new QueryClient();

  // Use React Query to fetch the card
  const {
    data: card,
    isLoading,
    isError,
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
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching card data.</div>;

  return (
    <div className="">
      {card ? (
        <div>
          <div>
            <h2 className="text-2xl flex justify-between font-bold mb-4 p-3 bg-white">
              <div>My Card</div>
              <div className="flex gap-4">
                <button
                  onClick={handleEdit} // Use handleEdit instead of setIsDialog2Open
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <div>Share</div>
              </div>
            </h2>
          </div>
          <div className="flex justify-center items-center mt-10">
            <StudentIdCard
              key={card.id}
              gender={card.gender}
              studentImage={card.imagelink}
              studentName={card.fullName}
              year={card.year}
              program={card.program}
              profileLink=""
            />
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow-md w-1/2 text-center">
          <h2 className="text-xl font-bold">No ID Card Found</h2>
          <p>You don't have an ID card yet. Please create one.</p>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create ID Card
          </button>
        </div>
      )}

      {/* Dialog for creating a card */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Create ID Card</h2>
            <form onSubmit={handleSubmit}>
              {/* Form fields */}
              <div className="mb-4">
                <label>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="..."
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 mt-2 rounded"
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Program
                </label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
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
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={createCardMutation.isPending}>
                  Create Card
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
