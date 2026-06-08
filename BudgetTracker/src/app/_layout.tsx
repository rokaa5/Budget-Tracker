import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

const DARK = {
  bg: "#111111",
  tabBar: "#1a1a1a",
  active: "#DDD5F3",
  inactive: "#555555",
};

const TAB_BAR_HEIGHT = 65;
const CENTER_BTN_SIZE = 60;

function usePopAnimation() {
  const scale = useRef(new Animated.Value(1)).current;

  const pop = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.2,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1.0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const reset = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  return { scale, pop, reset };
}

function SideTabIcon({
  children,
  label,
  onPress,
  selected,
}: {
  children: React.ReactNode;
  label: string;
  onPress?: () => void;
  selected?: boolean;
}) {
  const { scale, pop, reset } = usePopAnimation();

  return (
    <Pressable
      onPress={() => {
        pop();
        onPress?.();
      }}
      onPressOut={reset}
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: 4,
        paddingBottom: 8,
      }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
      <Text
        style={{ fontSize: 10, color: selected ? DARK.active : DARK.inactive }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function CenterTabIcon({
  onPress,
  selected,
}: {
  onPress?: () => void;
  selected?: boolean;
}) {
  const { scale, pop, reset } = usePopAnimation();
  const color = selected ? DARK.active : DARK.inactive;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 10,
      }}
    >
      {/* fake cutout using two corner pieces */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 20,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {/* left side corner */}
        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: DARK.tabBar,
            borderTopRightRadius: 20,
          }}
        />
        {/* gap for the button */}
        <View style={{ width: CENTER_BTN_SIZE + 16 }} />
        {/* right side corner */}
        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: DARK.tabBar,
            borderTopLeftRadius: 20,
          }}
        />
      </View>

      <Pressable
        onPress={() => {
          pop();
          onPress?.();
        }}
        onPressOut={reset}
        style={{ alignItems: "center", gap: 4 }}
      >
        <Animated.View
          style={{
            transform: [{ scale }],
            width: CENTER_BTN_SIZE,
            height: CENTER_BTN_SIZE,
            borderRadius: CENTER_BTN_SIZE / 2,
            backgroundColor: selected ? "#2e2a40" : "#222222",
            borderWidth: 2,
            borderColor: color,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="plus" size={24} color={color} />
        </Animated.View>
        <Text style={{ fontSize: 10, color }}> Create</Text>
      </Pressable>
    </View>
  );
}

export function TabScreenWrapper({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  Animated.parallel([
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start();

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity,
        transform: [{ translateY }],
        backgroundColor: DARK.bg,
      }}
    >
      {children}
    </Animated.View>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: TAB_BAR_HEIGHT + 20,
      }}
    >
      {/* main tab bar background — sits below center button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: TAB_BAR_HEIGHT,
          backgroundColor: DARK.tabBar,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          height: TAB_BAR_HEIGHT + 20,
          alignItems: "flex-end",
        }}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isCenter = index === 1;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isCenter) {
            return (
              <CenterTabIcon
                key={route.key}
                onPress={onPress}
                selected={isFocused}
              />
            );
          }

          return (
            <SideTabIcon
              key={route.key}
              label={options.title ?? route.name}
              onPress={onPress}
              selected={isFocused}
            >
              {index === 0 ? (
                <AntDesign
                  name="home"
                  size={24}
                  color={isFocused ? DARK.active : DARK.inactive}
                />
              ) : (
                <MaterialCommunityIcons
                  name="dots-horizontal"
                  size={24}
                  color={isFocused ? DARK.active : DARK.inactive}
                />
              )}
            </SideTabIcon>
          );
        })}
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: DARK.active,
        tabBarInactiveTintColor: DARK.inactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Tabs.Screen
        name="create"
        options={{ title: "Create", headerShown: false }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: "More", headerShown: false }}
      />
    </Tabs>
  );
}
