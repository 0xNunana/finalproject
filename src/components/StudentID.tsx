// components/StudentIdCard.tsx
import React, { forwardRef, ForwardRefRenderFunction } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
interface StudentIdCardProps {
  studentImage: string; // URL of the student's image
  studentName: string;
  year: string;
  program: string;
  gender: string;
  profileLink: string;
}

const StudentIdCard = forwardRef<HTMLDivElement, StudentIdCardProps>(
  ({ studentImage, studentName, gender, year, program, profileLink }, ref) => {
    return (
      <div
        ref={ref}
        className="border-gray-300 rounded-lg shadow-lg bg-white   w-[350px] h-[170px] md:w-[600px] md:h-[300px]"
      >
        <div className=" flex justify-center items-center py-2">
          <Image
            src="/havard.png" // Replace with the actual path to the Harvard logo
            alt="Harvard Logo"
            width={40}
            height={40}
            className="w-4 h-4"
          />
          <p className=" text-gray-500 font-semibold text-xs md:text-base">
            Harvard University
          </p>
        </div>
        <div className="flex  gap-2 md:gap-4 md:px-2  h-[123px]  md:h-[230px] ">
          <div className="w-2/6 bg-red-200 flex justify-center">
            <Image
              src={studentImage || "/havard.png"}
              alt={`${studentName}'s photo`}
              width={500}
              height={500}
              className="rounded-md mb-4 bg-gray-100 w-full h-full object-cover"
            />
          </div>
          <div className="w-4/6 ">
            <div className="mt-1 md:mt-5 ">
              <h2 className=" text-sm md:text-xl font-bold text-gray-900">
                {studentName}
              </h2>

              <p className="text-xs md:text-sm text-gray-600 font-bold flex items-center gap-2">
                Program:{" "}
                <span className="text-xs md:text-lg font-semibold">
                  {program}
                </span>
              </p>
            </div>
            <div
              className="grid grid-cols-2  h-[40px] md:h-[155px] 
           "
            >
              <div className=" relative">
                <p className="text-xs md:text-sm text-gray-600 font-bold">
                  Year: {year}
                </p>
                <p className="text-xs md:text-sm text-gray-600 font-bold">
                  Gender: {gender}
                </p>
                <p className="text-xs md:text-sm text-gray-600 font-bold absolute bottom-10 md:bottom-0">
                  Life Long Validity
                </p>
              </div>
              <div className=" flex items-center justify-center">
                <QRCodeSVG value={profileLink} className="w-10 md:w-40" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-3">
            <p className="text-xs md:text-base transform rotate-90 text-gray-500 font-bold">
              veritas
            </p>
          </div>
        </div>
        <p className="text-xs md:text-base text-center text-gray-500 font-bsemibold ">
          Issued by Harvard University, 0xNunana Final CS50x project
        </p>
      </div>
    );
  }
);

export default StudentIdCard;
