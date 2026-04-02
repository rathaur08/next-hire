"use client";

import { useForm, Controller } from "react-hook-form";
import {
  User,
  MapPin,
  Calendar,
  Flag,
  Briefcase,
  Globe,
  UploadCloud,
  Loader,
  Mail,
  Phone,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  applicantSettingsSchema,
  ApplicantSettingsSchema,
} from "../applicantSettingsSchema";
import Tiptap from "@/components/text-editor";
import { ImageUpload } from "@/features/employers/components/EmployerSettingForm";
import { cn } from "@/lib/utils";
import { ResumeUpload } from "./ResumeUpload";
import {
  // createApplicantProfile,
  saveApplicantProfile,
} from "../actions/ApplicantAction";
import { toast } from "sonner";
import { ApplicantProfileType } from "../server/ApplicantQueries"

interface ApplicantSettingsFormProps {
  initialData: ApplicantProfileType | null;
}

const ApplicantSettingsForm = ({ initialData }: ApplicantSettingsFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ApplicantSettingsSchema>({
    resolver: zodResolver(applicantSettingsSchema),
    defaultValues: initialData || {
      email: "", // Fallback if no data at all
    },
  });

  const isUpdating = !!initialData?.location; //Boolean coercion

  const onSubmit = async (data: ApplicantSettingsSchema) => {
    console.log("Saving Data:", data);

    try {
      const res = await saveApplicantProfile(data);
      if (res.status === "SUCCESS") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Form Submission Error:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              This is how employers will see you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6 mb-6">
              <div>
                <div className="text-center space-y-1">
                  <Controller
                    name="avatarUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div>
                        <Label>Upload Logo *</Label>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          className={cn(
                            fieldState.error &&
                              "ring-1 ring-destructive/50 rounded-full",
                            "h-34 w-34",
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
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Max file size is 5MB. Minimum dimension: 150x150</p>
                <p>Suitable files are .jpg and .png</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("name")}
                    placeholder="John Doe"
                    className={`pl-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("email")}
                    placeholder="john@example.com"
                    className="pl-10 bg-gray-50"
                    readOnly
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("phoneNumber")}
                    placeholder="+1 234 567 890"
                    className={`pl-10 ${errors.phoneNumber ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("location")}
                    placeholder="New York, USA"
                    className={`pl-10 ${errors.location ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  {...register("dateOfBirth")}
                  className={`pl-10 ${errors.dateOfBirth ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Nationality</Label>
              <div className="relative">
                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  {...register("nationality")}
                  placeholder="American"
                  className={`pl-10 ${errors.nationality ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </div>
              {errors.nationality && (
                <p className="text-sm text-destructive">
                  {errors.nationality.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={
                        errors.gender
                          ? "border-destructive focus:ring-destructive"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-sm text-destructive">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Marital Status</Label>
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={
                        errors.maritalStatus
                          ? "border-destructive focus:ring-destructive"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.maritalStatus && (
                <p className="text-sm text-destructive">
                  {errors.maritalStatus.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Profile</CardTitle>
            <CardDescription>
              Highlight your skills and experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Highest Education</Label>
                <Controller
                  name="education"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          errors.education
                            ? "border-destructive focus:ring-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select Education" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="high school">High School</SelectItem>
                        <SelectItem value="undergraduate">
                          Undergraduate
                        </SelectItem>
                        <SelectItem value="masters">Masters</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.education && (
                  <p className="text-sm text-destructive">
                    {errors.education.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Experience</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("experience")}
                    placeholder="e.g. 5 Years"
                    className={`pl-10 ${errors.experience ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>
                {errors.experience && (
                  <p className="text-sm text-destructive">
                    {errors.experience.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Portfolio Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  {...register("websiteUrl")}
                  placeholder="https://..."
                  className={`pl-10 ${errors.websiteUrl ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </div>
              {errors.websiteUrl && (
                <p className="text-sm text-destructive">
                  {errors.websiteUrl.message}
                </p>
              )}
            </div>

            {/* <div className="space-y-2">
              <Label>Biography</Label>
              <Textarea
                {...register("biography")}
                className={`min-h-[120px] ${errors.biography ? "border-destructive focus-visible:ring-destructive" : ""}`}
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-between items-start">
                {errors.biography && (
                  <p className="text-sm text-destructive">
                    {errors.biography.message}
                  </p>
                )}
                <p className="text-[10px] text-right text-muted-foreground ml-auto">
                  Max 500 characters
                </p>
              </div>
            </div> */}

            <div className="space-y-2">
              <Controller
                name="biography"
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label>Biography </Label>
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

            <Separator />

            {/* --- RESUME UPLOAD --- */}
            {/* <div className="space-y-4">
              <Label className="text-base">Resume / CV</Label>

              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf"
                {...register("resume")}
              />

              <label
                htmlFor="resume-upload"
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition cursor-pointer 
                    ${errors.resume ? "border-destructive bg-destructive/5" : "border-gray-200 hover:bg-gray-50"}
                  `}
              >
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <h4 className="font-medium text-sm">
                  Click to upload or drag and drop
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF (Max 5MB)
                </p>
              </label>

              {errors.resume && (
                <p className="text-sm text-destructive text-center font-medium">
                  {errors.resume.message as string}
                </p>
              )}
            </div> */}

            {/* --- RESUME UPLOAD --- */}
            <div className="space-y-4">
              <Label className="text-base">Your Cv/Resume</Label>

              <Controller
                name="resumeUrl"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <ResumeUpload
                      value={field.value}
                      onChange={(url, name, size) => {
                        // We update BOTH fields in React Hook Form when upload finishes
                        field.onChange(url);
                        setValue("resumeName", name, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("resumeSize", size, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-destructive mt-2">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            // Disable the button if submitting OR if the user hasn't changed any fields
            disabled={isSubmitting || !isDirty}
            className="min-w-[150px]"
          >
            {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}

            {isSubmitting
              ? isUpdating
                ? "Updating..."
                : "Saving..."
              : isUpdating
                ? "Update Profile"
                : "Save Profile"}
          </Button>

          {!isDirty && (
            <p className="text-sm text-muted-foreground">No changes to save</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ApplicantSettingsForm;
