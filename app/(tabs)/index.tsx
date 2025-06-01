import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Text, View, Image, ScrollView } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} resizeMode="cover" className="absolute w-full z-0" />
    <ScrollView>
      <Image source={icons.logo} className="w-12 h-12 mx-auto mb-5 mt-20" />
    </ScrollView>

    </View>
  );
}
