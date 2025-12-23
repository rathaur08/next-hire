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
  MapPin,
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
    },
    resolver: zodResolver(employerProfileSchema),
  });

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
            <div className="space-y-2">
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
