import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";

const steps = [
  { id: 1, title: "Company Details" },
  { id: 2, title: "Categories" },
  { id: 3, title: "Bank Info" },
  { id: 4, title: "Password Setup" },
];

export const SellerRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "categories" });
  const { toast } = useToast();

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
          <h1 className="text-2xl font-semibold text-center mb-4">Become a Seller</h1>
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id === currentStep
                      ? "bg-accent text-black"
                      : step.id < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.id < currentStep ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <span className="text-xs mt-2 text-center md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Company Details */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-up">
              <input {...register("companyName", { required: true })} placeholder="Company Name" className="form-input w-full border p-2 rounded-md" />
              <textarea {...register("officeAddress", { required: true })} placeholder="Office Address" className="form-input w-full border p-2 rounded-md" rows={3} />
              <input {...register("city", { required: true })} placeholder="City" className="form-input w-full border p-2 rounded-md" />
              <input {...register("state", { required: true })} placeholder="State" className="form-input w-full border p-2 rounded-md" />
              <input {...register("pinCode", { required: true })} placeholder="Pin Code" className="form-input w-full border p-2 rounded-md" />
              <input {...register("gstPan", { required: true })} placeholder="GST/PAN Number" className="form-input w-full border p-2 rounded-md" />
              <input {...register("phone", { required: true })} placeholder="Phone Number" className="form-input w-full border p-2 rounded-md" />
              <input {...register("email", { required: true })} placeholder="Email" className="form-input w-full border p-2 rounded-md" />
            </div>
          )}

          {/* Step 2: Categories */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-up">
              <label className="block text-sm font-medium mb-1">Categories</label>
              {fields.map((category, index) => (
                <div key={category.id} className="flex items-center gap-2">
                  <input {...register(`categories.${index}.name`, { required: true })} placeholder="Category Name" className="form-input flex-1 border p-2 rounded-md" />
                  <button type="button" onClick={() => remove(index)} className="text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => append({ name: "" })} className="flex items-center gap-2 text-blue-500">
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
          )}

          {/* Step 3: Bank Info */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-up">
              <input {...register("accountHolderName", { required: true })} placeholder="Account Holder Name" className="form-input w-full border p-2 rounded-md" />
              <input {...register("bankName", { required: true })} placeholder="Bank Name" className="form-input w-full border p-2 rounded-md" />
              <input {...register("accountNumber", { required: true })} placeholder="Account Number" className="form-input w-full border p-2 rounded-md" />
              <input {...register("ifscCode", { required: true })} placeholder="IFSC Code" className="form-input w-full border p-2 rounded-md" />
            </div>
          )}

          {/* Step 4: Password Setup */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-up">
              <input {...register("password", { required: true, minLength: 6 })} type="password" placeholder="Password" className="form-input w-full border p-2 rounded-md" />
              <input {...register("confirmPassword", { required: true, minLength: 6 })} type="password" placeholder="Confirm Password" className="form-input w-full border p-2 rounded-md" />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <button type="button" onClick={() => setCurrentStep((prev) => prev - 1)} className="btn-secondary py-2 px-4 bg-gray-300 rounded-md">
                <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
                Previous
              </button>
            )}
            <button type="submit" className="btn-primary ml-auto py-2 px-4 bg-primary text-white rounded-md flex items-center">
              {currentStep === steps.length ? "Complete" : "Next"}
              {currentStep < steps.length && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
