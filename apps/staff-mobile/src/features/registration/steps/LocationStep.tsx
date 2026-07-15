import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { CheckCircle2, LocateFixed } from "lucide-react-native";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Select } from "@/src/components/ui/Select";
import { fetchProgrammes, programmesToOptions } from "@/src/features/registration/programmes";
import type { RegistrationFormValues } from "@/src/features/registration/schema";

export const LocationStep = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationFormValues>();
  const coordinates = watch("coordinates");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const programmesQuery = useQuery({ queryKey: ["programmes"], queryFn: fetchProgrammes });
  const programmeOptions = programmesToOptions(programmesQuery.data ?? []);

  const captureLocation = async () => {
    setLocationError(null);
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied — you can still register without GPS coordinates.");
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setValue(
        "coordinates",
        { latitude: position.coords.latitude, longitude: position.coords.longitude },
        { shouldValidate: true },
      );
    } catch {
      setLocationError("Couldn't get GPS location. Check that location services are enabled.");
    } finally {
      setLocating(false);
    }
  };

  return (
    <View className="gap-5">
      <Controller
        control={control}
        name="locationLabel"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            error={errors.locationLabel?.message}
            label="Registration location"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="e.g. Kalobeyei Village, Turkana West"
            value={value}
          />
        )}
      />

      <View className="gap-2">
        <Button icon={LocateFixed} loading={locating} onPress={captureLocation} variant="outline">
          {coordinates ? "Recapture GPS location" : "Capture GPS location"}
        </Button>
        {coordinates ? (
          <View className="flex-row items-center gap-2">
            <CheckCircle2 color="#16a34a" size={16} />
            <Text className="text-sm text-muted-foreground">
              {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
            </Text>
          </View>
        ) : null}
        {locationError ? <Text className="text-sm text-destructive">{locationError}</Text> : null}
      </View>

      <Controller
        control={control}
        name="programmeId"
        render={({ field: { onChange, value } }) => (
          <Select
            error={errors.programmeId?.message}
            label="Programme"
            onChange={(nextId) => {
              const programme = (programmesQuery.data ?? []).find((item) => item.id === nextId);
              onChange(nextId);
              setValue("programmeName", programme?.name ?? "", { shouldValidate: true });
            }}
            options={programmeOptions}
            placeholder={programmesQuery.isLoading ? "Loading programmes…" : "Select a programme"}
            value={value}
          />
        )}
      />
    </View>
  );
};
