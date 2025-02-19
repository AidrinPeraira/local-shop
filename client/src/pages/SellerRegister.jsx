import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useToast } from "../components/hooks/use-toast"; // Ensure this hook exists

const steps = [
  { id: 1, title: "Office Details" },
  { id: 2, title: "Contact Info" },
  { id: 3, title: "Categories" },
  { id: 4, title: "Tax Details" },
  { id: 5, title: "Bank Info" },
];

export const SellerRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { toast } = useToast(); // Ensure this works properly

  const onSubmit = (data) => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast({
        title: "Registration Complete",
        description: "Your seller account has been created successfully.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-center mb-4">
            Become a Seller
          </h1>
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id === currentStep
                      ? "bg-accent text-white"
                      : step.id < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.id < currentStep ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span className="text-xs mt-2 text-center hidden md:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-up">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
                  {...register("companyName", { required: true })}
                  className="form-input w-full border p-2 rounded-md"
                />
                {errors.companyName && (
                  <span className="text-red-500 text-sm">This field is required</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Office Address</label>
                <textarea
                  {...register("officeAddress", { required: true })}
                  className="form-input w-full border p-2 rounded-md"
                  rows={3}
                />
                {errors.officeAddress && (
                  <span className="text-red-500 text-sm">This field is required</span>
                )}
              </div>
            </div>
          )}

          {/* Add similar sections for other steps */}

          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="btn-secondary py-2 px-4 bg-gray-300 rounded-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
                Previous
              </button>
            )}
            <button
              type="submit"
              className="btn-primary ml-auto py-2 px-4 bg-primary text-white rounded-md flex items-center"
            >
              {currentStep === steps.length ? "Complete" : "Next"}
              {currentStep < steps.length && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

