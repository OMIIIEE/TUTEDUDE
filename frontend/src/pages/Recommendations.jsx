import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../components/ui/button";

const Recommendations = () => {
  const { recommendations } = useSelector((state) => state.friends);

  return (
    <div className="flex h-screen">
      <div className="w-64 p-4 bg-gray-800 text-white">
        <h2 className="mb-4 text-xl font-bold">Recommendations</h2>
      </div>

      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Friend Recommendations</h1>
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="p-4 bg-white rounded shadow-md">
              <p>{recommendation.fullname}</p>
              <Button className="mt-2 w-full bg-blue-500 hover:bg-blue-600">
                Add Friend
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
