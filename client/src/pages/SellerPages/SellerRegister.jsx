import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import { useToast } from "../../components/hooks/use-toast";
import { NestedCategoryDropdown } from "../../components/seller/NestedCategoryDropdown";
import { get } from "lodash";
import { sellerRegApi } from "../../api/userAuthApi";
import { registerSeller } from "../../redux/features/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useRedirectIfAuthenticated } from "../../components/hooks/useRedirectIfAuthenticated";

const steps = [
  { id: 1, title: "Company Details" },
  { id: 2, title: "Categories" },
  { id: 3, title: "Bank Info" },
  { id: 4, title: "Password Setup" },
];

// Component for the nested category dropdown

export default () => {
  useRedirectIfAuthenticated();
  const [currentStep, setCurrentStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //react hook form to get all the data into one object efficiently
  const {
    register, handleSubmit, control, setValue, formState: { errors }, trigger, watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      sellerName: "",
      phone: "",
      email: "",
      password: "",
      bankDetails: {
        bankName: "",
        accountHolderName: "",
        ifscCode: "",
        accountNumber: "",
      },
      address: {
        officeName: "",
        city: "",
        state: "",
        pincode: "",
      },
      taxId: "",
      productCategories: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productCategories",
  });
  const { toast } = useToast();

  const handleCategorySelect = (index, categoryId, categoryPath) => {
    setValue(`productCategories.${index}.id`, categoryId);
    setValue(`productCategories.${index}.path`, categoryPath);
  };

  const addCategory = () => {
    append({ id: "", path: "" });
  };

  const validationErrorToast = (field) => {
    if (!errors) return;

    const fieldError = get(errors, field);
    if (fieldError) {
      toast({
        title: "Input Error",
        description: fieldError.message || "All fields are required",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data) => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const sellerData = {
        ...data,
        productCategories: data.productCategories.map((cat) => cat.id),
      };
      console.log("Seller Reg Form data:", sellerData);

      dispatch(registerSeller(sellerData))
        .unwrap() //breaks open the promise to give value if success and throw rejectWithVakue error if rejected
        .then(() => {
          toast({
            title: "Registered and Logged In",
            description: "Happy Selling",
            variant: "default",
          });
          navigate("/seller");
        })
        .catch((error) => {
          console.error(
            "Seller Reg Dispatch Error: ",
            error || "Some error occured. Please try again"
          );
          toast({
            title: "Registration Error!",
            description: error,
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="bg-secondary">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center">
            <Link to="/seller/login">
              <span className="text-2xl font-bold">
                local<span className="text-primary">Shop</span>
              </span>
            </Link>
          </div>
        </div>
      </header>
      <div className="container  mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-center mb-4">
              Become a Seller
            </h1>
            <div className="flex justify-between items-center">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step.id === currentStep
                        ? "bg-accent text-black"
                        : step.id < currentStep
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"}`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center md:block">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Company Details */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-up">
                <input
                  {...register("sellerName", {
                    required: true,
                    pattern: {
                      value: /^[a-zA-Z\s]{3,50}$/,
                      message: "Invalid seller name. Must be 3-50 characters long.",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("sellerName");
                    if (!result) validationErrorToast("sellerName");
                  } }
                  placeholder="Seller Name"
                  className="form-input w-full border p-2 rounded-md" />
                <textarea
                  {...register("address.officeName", {
                    required: true,
                    pattern: {
                      value: /^[a-zA-Z0-9\s,./-]{3,50}$/,
                      message: "Invalid office name. Must be 3-50 characters long.",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("address.officeName");
                    if (!result) validationErrorToast("address.officeName");
                  } }
                  placeholder="Office Address"
                  className="form-input w-full border p-2 rounded-md"
                  rows={3} />
                <input
                  {...register("address.city", {
                    required: true,
                    pattern: {
                      value: /^[a-zA-Z\s]{3,50}$/,
                      message: "Invalid city name. Must be 3-50 characters long.",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("address.city");
                    if (!result) validationErrorToast("address.city");
                  } }
                  placeholder="City"
                  className="form-input w-full border p-2 rounded-md" />
                <input
                  {...register("address.state", {
                    required: true,
                    pattern: {
                      value: /^[a-zA-Z\s]{3,50}$/,
                      message: "Invalid state name. Must be 3-50 characters long.",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("address.state");
                    if (!result) validationErrorToast("address.state");
                  } }
                  placeholder="State"
                  className="form-input w-full border p-2 rounded-md" />
                <input
                  {...register("address.pincode", {
                    required: true,
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Invalid pincode format. Must be Indian postal code.",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("address.pincode");
                    if (!result) validationErrorToast("address.pincode");
                  } }
                  placeholder="Pin Code"
                  className="form-input w-full border p-2 rounded-md" />
                <input
                  {...register("taxId", {
                    required: true,
                    pattern: {
                      value: /(^[A-Z]{5}[0-9]{4}[A-Z]$)|(^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9][A-Z][0-9]$)/,
                      message: "Invalid tax ID. Must be a PAN or GST Number",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("taxId");
                    if (!result) validationErrorToast("taxId");
                  } }
                  placeholder="GST/PAN Number"
                  className="form-input w-full border p-2 rounded-md" />
                <input
                  {...register("phone", {
                    required: true,
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Invalid phone number.",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("phone");
                    if (!result) validationErrorToast("phone");
                  } }
                  placeholder="Phone Number"
                  className="form-input w-full border p-2 rounded-md" />
                <input
                  {...register("email", {
                    required: true,
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email format.",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("email");
                    if (!result) validationErrorToast("email");
                  } }
                  placeholder="Email"
                  className="form-input w-full border p-2 rounded-md" />
              </div>
            )}

            {/* Step 2: Categories */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-up">
                <label className="block text-sm font-medium mb-1">
                  Select Your Product Categories
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Add the categories you want to sell products in. You can only
                  select specific product categories (level 3).
                </p>

                {fields.map((item, index) => (
                  <div key={item.id} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="hidden"
                        {...register(`productCategories.${index}.id`, {
                          required: true,
                        })} />
                      <div className="flex-1">
                        <NestedCategoryDropdown
                          onSelectCategory={(categoryId, categoryPath) => handleCategorySelect(index, categoryId, categoryPath)} />
                        {errors?.categories?.[index]?.id && (
                          <p className="text-red-500 text-xs mt-1">
                            Please select a category
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1 bg-red-50 text-red-500 rounded-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCategory}
                  className="flex items-center gap-2 text-blue-500 mt-2"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>

                {fields.length === 0 && (
                  <p className="text-amber-500 text-sm">
                    Please add at least one category
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Bank Info */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-up">
                <input
                  {...register("bankDetails.accountHolderName", {
                    required: true,
                    pattern: {
                      value: /^[a-zA-Z\s]{3,50}$/,
                      message: "Invalid account holder name. Must be 3-50 charcters",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("bankDetails.accountHolderName");
                    if (!result)
                      validationErrorToast("bankDetails.accountHolderName");
                  } }
                  placeholder="Account Holder Name"
                  className="form-input w-full border p-2 rounded-md" />
                <input
                  {...register("bankDetails.bankName", {
                    required: true,
                    pattern: {
                      value: /^[a-zA-Z\s]{3,50}$/,
                      message: "Invalid Bank Name. Must be 3 - 50 Characters",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("bankDetails.bankName");
                    if (!result) validationErrorToast("bankDetails.bankName");
                  } }
                  placeholder="Bank Name"
                  className="form-input w-full border p-2 rounded-md" />
                <input
                  {...register("bankDetails.accountNumber", {
                    required: true,
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Invalid Account Number. Must be a at least 10 digits",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("bankDetails.accountNumber");
                    if (!result)
                      validationErrorToast("bankDetails.accountNumber");
                  } }
                  placeholder="Account Number"
                  className="form-input w-full border p-2 rounded-md" />
                <input
                  {...register("bankDetails.ifscCode", {
                    required: true,
                    pattern: {
                      value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                      message: "Invalid IFSC Code. ABCD0123123",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("bankDetails.ifscCode");
                    if (!result) validationErrorToast("bankDetails.ifscCode");
                  } }
                  placeholder="IFSC Code"
                  className="form-input w-full border p-2 rounded-md" />
              </div>
            )}

            {/* Step 4: Password Setup */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-fade-up">
                <input
                  {...register("password", {
                    required: true,
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                      message: "Password must be at least 6 characters long, contain one uppercase letter, one number, and one special character.",
                    },
                  })}
                  onBlur={async () => {
                    const result = await trigger("password");
                    if (!result) validationErrorToast("password");
                  } }
                  type="password"
                  placeholder="Password"
                  className="form-input w-full border p-2 rounded-md" />
                <input
                  {...register("confirmPassword", {
                    required: true,

                    validate: (value) => value === watch("password") ||
                      "The passwords do not match!",
                  })}
                  onBlur={async () => {
                    const result = await trigger("confirmPassword");
                    if (!result) validationErrorToast("confirmPassword");
                  } }
                  type="password"
                  placeholder="Confirm Password"
                  className="form-input w-full border p-2 rounded-md" />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="btn-secondary py-2 px-4 bg-gray-300 rounded-md"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 inline-block" />
                  Previous
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/seller/login')}
                  className="btn-secondary py-2 px-4 bg-white-300 rounded-md text-blue-800"
                >
                  <ArrowLeft className="w-6 h-4 mr-2 inline-block" />
                  Back to Login
                </button>
              )}

              <button
                type="submit"
                className="btn-primary ml-auto py-2 px-4 bg-primary text-white rounded-md flex items-center"
                disabled={currentStep === 2 && fields.length === 0}
              >
                {currentStep === steps.length ? "Complete" : "Next"}
                {currentStep < steps.length && (
                  <ArrowRight className="w-4 h-4 ml-2" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
