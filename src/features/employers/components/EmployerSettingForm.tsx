"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Globe,
  Loader,
  Loader2,
  MapPin,
  Upload,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  EmployerProfileData,
  employerProfileSchema,
  organizationTypes,
  teamSizes,
} from "../EmployerSchema";
import { updateEmployerProfileAction } from "@/features/server/EmployersAction";
import { zodResolver } from "@hookform/resolvers/zod";
import Tiptap from "@/components/text-editor";
import { UploadButton, useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ComponentProps, useState } from "react";
import { useDropzone } from "@uploadthing/react";

// interface IFormInput {
//   name: string;
//   description: string;
//   organizationType: string;
//   teamSize: string;
//   yearOfEstablishment: string;
//   websiteUrl: string;
//   location: string;
// }

const EmployerSettingForm = ({
  initialData,
}: {
  initialData?: Partial<EmployerProfileData>; // Key: Type
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch, //Give me the current value of this field in the form state, and re-render this component when it changes.
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EmployerProfileData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      organizationType: initialData?.organizationType || undefined,
      teamSize: initialData?.teamSize || undefined,
      yearOfEstablishment: initialData?.yearOfEstablishment,
      websiteUrl: initialData?.websiteUrl || "",
      location: initialData?.location || "",
      avatarUrl: initialData?.avatarUrl || "",
      bannerImageUrl: initialData?.bannerImageUrl || "",
    },
    resolver: zodResolver(employerProfileSchema),
  });

  const avatarUrl = watch("avatarUrl");
  const handleRemoveAvatar = () => {
    setValue("avatarUrl", ""); //Programmatically update a form field’s value inside react-hook-form.
  };

  const handleFormSubmit = async (data: EmployerProfileData) => {
    console.log("Employer Setting Form data: ", data);

    const response = await updateEmployerProfileAction(data);

    if (response.status === "SUCCESS") {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <Card className="w-3/4 ">
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  // Do something with the response
                  console.log("Files: ", res);
                  alert("Upload Completed");
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                    }}
                    /> */}

            {/* <div>
               <Label>Company Logo</Label>
              {avatarUrl ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-border">
                    <Image
                      src={avatarUrl}
                      alt="Company logo"
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveAvatar}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Logo
                  </Button>
                </div>
              ) : (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const profilePic = res[0];

                    setValue("avatarUrl", profilePic.ufsUrl, {
                      shouldDirty: true,
                    });
                    console.log("Files: ", res);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                />
              )}
            </div> */}

            <div className=" grid lg:grid-cols-[1fr_4fr] gap-6">
              <Controller
                name="avatarUrl"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label>Upload Logo *</Label>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      boxText={
                        "A photo larger than 400 pixels works best. Max photo size 5 MB."
                      }
                      className={cn(
                        fieldState.error &&
                          "ring-1 ring-destructive/50 rounded-lg",
                        "h-64 w-64"
                      )}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="bannerImageUrl"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label>Banner Image</Label>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      boxText={
                        "Banner images optimal dimension 1520×400. Supported format JPEG, PNG. Max photo size 5 MB."
                      }
                      className={cn(
                        fieldState.error &&
                          "ring-1 ring-destructive/50 rounded-lg",
                        "h-64 w-full"
                      )}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Enter company name"
                  className={`pl-10 ${
                    errors.name ? "border-destructive" : ""
                  } `}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            {/* <div className="space-y-2">
              <Label htmlFor="description">Company Description *</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Textarea
                  id="description"
                  placeholder="Tell us about your company, what you do, and your mission..."
                  className="pl-10 min-h-[120px] resize-none "
                  {...register("description")}
                />
              </div>
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div> */}

            <div className="space-y-2">
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Tiptap content={field.value} onChange={field.onChange} />

                    {fieldState.error && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* When you run const { control } = useForm(), you create a specific instance of a form. The <Controller /> component is isolated; it doesn't know which form it belongs to. Passing control={control} connects this specific input to that specific useForm hook. */}
            {/* Organization Type and Team Size - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Type */}
              <div className="space-y-2">
                <Label htmlFor="organizationType">Organization Type *</Label>

                <Controller
                  name="organizationType"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="pl-10 w-full ">
                          <SelectValue placeholder="Select organization type" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizationTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {/* {capitalizeWords(type)} */}
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {/* {errors.organizationType && (
                  <p className="text-sm text-destructive">
                    {errors.organizationType.message}
                  </p>
                )} */}
              </div>

              {/* Organization Type */}
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size *</Label>
                <Controller
                  name="teamSize"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="pl-10 w-full ">
                          <SelectValue placeholder="Select Team Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamSizes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {/* {capitalizeWords(type)} */}
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {/* {errors.teamSize && (
                  <p className="text-sm text-destructive">
                    {errors.teamSize.message}
                  </p>
                )} */}
              </div>
            </div>

            {/* Year of Establishment and Location - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="yearOfEstablishment">
                  Year of Establishment *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="yearOfEstablishment"
                    type="text"
                    placeholder="e.g., 2020"
                    maxLength={4}
                    className="pl-10"
                    {...register("yearOfEstablishment")}
                  />
                </div>
                {/* {errors.yearOfEstablishment && (
                  <p className="text-sm text-destructive">
                    {errors.yearOfEstablishment.message}
                  </p>
                )} */}
              </div>

              {/* Year of Establishment and Location - Two columns */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g., Pune, Bangalore"
                    className="pl-10"
                    {...register("location")}
                  />
                </div>
              </div>
              {/* {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location.message}
                </p>
              )} */}
            </div>
            {/* Website URL */}
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="websiteUrl"
                  type="text"
                  placeholder="https://www.yourcompany.com"
                  className="pl-10"
                  {...register("websiteUrl")}
                />
              </div>
              {/* {errors.websiteUrl && (
                <p className="text-sm text-destructive">
                  {errors.websiteUrl.message}
                </p>
              )} */}
            </div>
            <div className="flex items-center gap-4 pt-4">
              <Button type="submit">
                {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </Button>

              {!isDirty && (
                <p className="text-sm text-muted-foreground">
                  No changes to save
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default EmployerSettingForm;

type ImageUploadProps = Omit<ComponentProps<"div">, "onChange"> & {
  value?: string;
  boxText?: string;
  onChange: (url: string) => void;
};

export const ImageUpload = ({
  value,
  onChange,
  className,
  boxText,
  ...props
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onChange(res[0].ufsUrl);
        toast.success("Image uploaded successfully!");
      }
      setIsUploading(false);
      setPreviewUrl(null);
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setIsUploading(false);
      setPreviewUrl(null);
    },
  });

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    await startUpload([file]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileSelect,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setPreviewUrl(null);
  };

  if (value || previewUrl)
    return (
      <div
        className={cn(
          "overflow-hidden border-2 border-border relative group rounded-lg",
          className
        )}
        {...props}
      >
        <Image
          src={previewUrl || value || ""}
          alt="Uploaded image"
          height={200}
          width={200}
          className="w-full h-full object-cover"
        />

        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <p className="text-sm text-white font-medium">Uploading...</p>
            </div>
          </div>
        )}

        {!isUploading && (
          <div
            {...getRootProps()}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            <input {...getInputProps()} />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        )}
      </div>
    );

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        isUploading && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Upload className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          <span className="text-primary">Browse photo</span> or drop here
        </p>
        {boxText && (
          <p className="text-xs text-muted-foreground text-center px-4 max-w-xs">
            {boxText}
          </p>
        )}
      </div>
    </div>
  );
};
