import { Text, View } from "react-native";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  stepLabel: string;
}

export const ProgressBar = ({ step, totalSteps, stepLabel }: ProgressBarProps) => {
  const progress = Math.min(100, Math.round((step / totalSteps) * 100));

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium text-muted-foreground">
          Step {step} of {totalSteps}
        </Text>
        <Text className="text-sm font-medium text-foreground">{stepLabel}</Text>
      </View>
      <View className="h-1.5 overflow-hidden rounded-full bg-muted">
        <View className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
      </View>
    </View>
  );
};
