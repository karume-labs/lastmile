import * as ImagePicker from "expo-image-picker";
import { Camera, ImageIcon, X } from "lucide-react-native";
import { Controller, useFormContext } from "react-hook-form";
import { Image, Text, View } from "react-native";
import { Button } from "@/src/components/ui/Button";
import { Checkbox } from "@/src/components/ui/Checkbox";
import type { RegistrationFormValues } from "@/src/features/registration/schema";

export const PhotoConsentStep = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();
  const photoUri = watch("photoUri");

  const pickFrom = async (source: "camera" | "library") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({ quality: 0.6, allowsEditing: true, aspect: [1, 1] })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.6, allowsEditing: true, aspect: [1, 1] });

    if (!result.canceled && result.assets[0]) {
      setValue("photoUri", result.assets[0].uri, { shouldValidate: true });
    }
  };

  return (
    <View className="gap-5">
      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">Beneficiary photo (optional)</Text>
        {photoUri ? (
          <View className="flex-row items-center gap-3">
            <Image className="h-20 w-20 rounded-lg" source={{ uri: photoUri }} />
            <Button icon={X} onPress={() => setValue("photoUri", null)} size="sm" variant="outline">
              Remove
            </Button>
          </View>
        ) : (
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button icon={Camera} onPress={() => pickFrom("camera")} variant="outline">
                Take photo
              </Button>
            </View>
            <View className="flex-1">
              <Button icon={ImageIcon} onPress={() => pickFrom("library")} variant="outline">
                Choose photo
              </Button>
            </View>
          </View>
        )}
      </View>

      <Controller
        control={control}
        name="consentGiven"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            checked={value}
            error={errors.consentGiven?.message}
            label="The beneficiary (or their proxy) has been informed about how their data will be used and consents to registration."
            onChange={onChange}
          />
        )}
      />
    </View>
  );
};
