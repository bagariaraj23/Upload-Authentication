"use client";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Counter from "../inputs/Counter";
import Input from "../inputs/Input";
import ImageUpload from "../inputs/ImageUpload";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
  CATEGORY = 0,
  INFO = 1,
  IMAGES = 2,
  DESCRIPTION = 3,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      vehicleType: "",
      passengerCount: 1,
      imagesSrc: [],
      docImagesSrc: [],
      insImagesSrc: [],
      polImagesSrc: [],
      make: "",
      model: "",
      year: 2024,
      color: "",
      title: "",
      description: "",
    },
  });

  const category = watch("category");
  const passengerCount = watch("passengerCount");
  const imagesSrc = watch("imagesSrc");
  const docImagesSrc = watch("docImagesSrc");
  const insImagesSrc = watch("insImagesSrc");
  const polImagesSrc = watch("polImagesSrc");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.DESCRIPTION) {
      return onNext();
    }

    setIsLoading(true);
    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing created successfully");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.DESCRIPTION) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Which of these best describes your vehicle?"
        subtitle="Pick a Category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[50vh]">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some details about your vehicle"
          subtitle="What are you renting out?"
        />
        <Counter
          title="Number of Passengers"
          subtitle="How many people can fit in your vehicle?"
          value={passengerCount}
          onChange={(value) => setCustomValue("passengerCount", value)}
        />
        <hr />
        <Input
          id="make"
          label="Make"
          placeholder="e.g. Toyota, Honda, etc."
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="model"
          label="Model"
          placeholder="e.g. Corolla, Civic, etc."
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="color"
          label="Color"
          placeholder="e.g. Red, Blue, etc."
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="year"
          label="Year"
          disabled={isLoading}
          register={register}
          errors={errors}
          type="number"
          required
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Documents" subtitle="Add documents and papers" />
        <ImageUpload
          value={docImagesSrc}
          onChange={(value) => setCustomValue("docImagesSrc", value)}
        />
        <hr />
        <Heading
          title="Insurance"
          subtitle="Add insurance information and papers"
        />
        <ImageUpload
          value={insImagesSrc}
          onChange={(value) => setCustomValue("insImagesSrc", value)}
        />
        <hr />
        <Heading
          title="Pollution"
          subtitle="Add pollution information and papers"
        />
        <ImageUpload
          value={polImagesSrc}
          onChange={(value) => setCustomValue("polImagesSrc", value)}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Description"
          subtitle="Add description of your vehicle"
        />
        <Input
          id="title"
          label="Title"
          placeholder="Car for rent"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          placeholder="Any extra details about your vehicle?"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Heading
          title="Add some images of your vehicle"
          subtitle="What does it look like?"
        />
        <ImageUpload
          value={imagesSrc}
          onChange={(value) => setCustomValue("imagesSrc", value)}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title="Upload Details of Vehicle"
      body={bodyContent}
    />
  );
};

export default RentModal;
