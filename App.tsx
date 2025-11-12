import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";

type Meal = {
  name: string;
  price: number;
  category: "Starters" | "Mains" | "Desserts";
  description: string;
};

type RootStackParamList = {
  Home: undefined;
  ChefManager: undefined;
  GuestFilter: undefined;
  Checkout: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();



// Bottom Navigation

function BottomNav({ navigation }: { navigation: any }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home" size={24} color="#00aaff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ChefManager")}>
        <Entypo name="add-to-list" size={24} color="#00aaff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("GuestFilter")}>
        <MaterialIcons name="filter-list" size={24} color="#00aaff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Checkout")}>
        <Ionicons name="cart" size={24} color="#00aaff" />
      </TouchableOpacity>
    </View>
  );
}

// Main App

export default function App() {
  const [meals, setMeals] = useState<Meal[]>([
  {
    name: "Garlic Bread",
    price: 45,
    category: "Starters",
    description: "Crispy oven-baked bread topped with garlic butter and herbs.",
  },
  {
    name: "Bruschetta",
    price: 55,
    category: "Starters",
    description: "Toasted bread topped with fresh tomatoes, basil, and olive oil.",
  },
  {
    name: "Creamy mushroom soup",
    price: 75,
    category: "Starters",
    description: "Use porcini and wild mushrooms to make this rich and creamy soup. Serve with croutons and chives",
  },
  {
    name: "Buffalo Wings and Ribs",
    price: 250,
    category: "Mains",
    description: "A hearty platter of BBQ ribs and spicy buffalo wings.",
  },
  {
    name: "BBQ Wrap",
    price: 150,
    category: "Mains",
    description: "Grilled chicken with smoky BBQ sauce wrapped in a soft tortilla.",
  },
  {
    name: "Rib Burger",
    price: 125,
    category: "Mains",
    description: "Tender rib meat served in a toasted bun with our special sauce.",
  },
  {
    name: "Chocolate Lava Cake",
    price: 90,
    category: "Desserts",
    description: "Warm chocolate cake with a molten chocolate center.",
  },
  {
    name: "Cheesecake",
    price: 85,
    category: "Desserts",
    description: "Creamy vanilla cheesecake with a crunchy biscuit base.",
  },
  {
    name: "Ice Cream Sundae",
    price: 70,
    category: "Desserts",
    description: "Vanilla ice cream topped with chocolate sauce and nuts.",
  },
]);


  const [cart, setCart] = useState<Meal[]>([]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} meals={meals} />}
        </Stack.Screen>
        <Stack.Screen name="ChefManager">
          {(props) => (
            <ChefManagerScreen {...props} meals={meals} setMeals={setMeals} />
          )}
        </Stack.Screen>
        <Stack.Screen name="GuestFilter">
          {(props) => (
            <GuestFilterScreen
              {...props}
              meals={meals}
              cart={cart}
              setCart={setCart}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Checkout">
          {(props) => <CheckoutScreen {...props} cart={cart} setCart={setCart} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Home Screen

function HomeScreen({ navigation, meals }: any) {
  const categories: ("Starters" | "Mains" | "Desserts")[] = [
    "Starters",
    "Mains",
    "Desserts",
  ];

  const getAveragePrice = (category: Meal["category"]) => {
    const filtered = meals.filter((m: Meal) => m.category === category);
    if (filtered.length === 0) return 0;
    const avg =
      filtered.reduce((sum: number, meal: Meal) => sum + meal.price, 0) / filtered.length;
    return avg.toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chef Kiss Menu</Text>

      <View style={styles.averageContainer}>
        {categories.map((cat) => (
          <Text key={cat} style={styles.averageText}>
            {cat}: R{getAveragePrice(cat)}
          </Text>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {categories.map((cat) => (
          <View key={cat} style={{ width: "90%" }}>
            <Text style={styles.categoryHeader}>{cat}</Text>
            {meals
              .filter((m: Meal) => m.category === cat)
              .map((meal: Meal, index: number) => (
                <View key={index} style={styles.mealRow}>
                  <Text style={styles.mealText}>{meal.name}</Text>
                  <Text style={styles.mealPrice}>R{meal.price}</Text>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>

      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}

// Chef Manager Screen

function ChefManagerScreen({ navigation, meals, setMeals }: any) {
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Meal["category"]>("Starters");

  const addMeal = () => {
    if (!dishName || !description || !price) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newMeal: Meal = {
      name: dishName,
      description,
      price: parseFloat(price),
      category,
    };

    setMeals((prev: Meal[]) => [...prev, newMeal]);
    setDishName("");
    setDescription("");
    setPrice("");
    Alert.alert("Success", "Meal added successfully!");
  };

  const removeMeal = (name: string) => {
    setMeals((prev: Meal[]) => prev.filter((m) => m.name !== name));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}> Chef Menu Manager</Text>

      {/* Dish Name */}
      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        placeholderTextColor="#999"
        value={dishName}
        onChangeText={setDishName}
      />

      {/* Description */}
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        placeholder="Description"
        placeholderTextColor="#999"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* Price */}
      <TextInput
        style={styles.input}
        placeholder="Price (e.g. 120)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* Category Buttons */}
      <View style={styles.categoryRow}>
        {(["Starters", "Mains", "Desserts"] as Meal["category"][]).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              category === cat && { backgroundColor: "#00aaff" },
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                category === cat && { color: "#fff" },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.saveButton} onPress={addMeal}>
        <Text style={styles.saveText}>Add Menu Item</Text>
      </TouchableOpacity>

      {/* Existing Meals List */}
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {meals.map((meal: Meal, index: number) => (
          <View key={index} style={styles.mealRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mealText}>
                {meal.name} ({meal.category})
              </Text>
              <Text style={styles.mealDescription}>{meal.description}</Text>
              <Text style={{ color: "#00aaff", fontWeight: "bold" }}>
                R{meal.price.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeMeal(meal.name)}>
              <Text style={{ color: "red", fontWeight: "bold" }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}
// Guest Filter Screen

function GuestFilterScreen({ navigation, meals, cart, setCart }: any) {
  const [selectedCategory, setSelectedCategory] =
    useState<Meal["category"]>("Starters");

  const filteredMeals = meals.filter((meal: Meal) => meal.category === selectedCategory);


  const addToCart = (meal: Meal) => {
    setCart((prev: Meal[]) => [...prev, meal]);
    Alert.alert("Added to Order", `${meal.name} added to your cart`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}> Guest Menu</Text>

      <View style={styles.categoryRow}>
        {(["Starters", "Mains", "Desserts"] as Meal["category"][]).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && { backgroundColor: "#00aaff" },
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === cat && { color: "#fff" },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {filteredMeals.map((meal: Meal, index: number) => (
          <View key={index} style={styles.mealRow}>
            <Text style={styles.mealText}>{meal.name}</Text>
            <TouchableOpacity onPress={() => addToCart(meal)}>
              <Text style={{ color: "#00aaff", fontWeight: "bold" }}>
                + Add (R{meal.price})
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}

// Checkout Screen 

function CheckoutScreen({ navigation, cart, setCart }: any) {
  const total = cart.reduce((sum: number, meal: Meal) => sum + meal.price, 0);

  const clearCart = () => {
    setCart([]);
    Alert.alert("Thank You!", "Your order has been placed successfully!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>💳 Checkout</Text>

      {cart.length === 0 ? (
        <Text style={{ color: "#0a0101ff", marginTop: 40 }}>
          No items in your order.
        </Text>
      ) : (
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          {cart.map((meal: Meal, index: number) => (
            <View key={index} style={styles.mealRow}>
              <Text style={styles.mealText}>{meal.name}</Text>
              <Text style={styles.mealPrice}>R{meal.price}</Text>
            </View>
          ))}

          <Text style={styles.totalText}>Total: R{total.toFixed(2)}</Text>

          <TouchableOpacity style={styles.saveButton} onPress={clearCart}>
            <Text style={styles.saveText}>Place Order</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e1e1ff",
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    color: "#090202ff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  averageContainer: {
    backgroundColor: "#f7f0f0ff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: "85%",
  },
  averageText: {
    color: "#01090cff",
    fontSize: 16,
    marginVertical: 3,
  },
  categoryHeader: {
    color: "#00aaff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: "90%",
  },
  mealText: { color: "#000", fontWeight: "600" },
  mealPrice: { color: "#626161ff" },
  totalText: {
    color: "#00aaff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#00aaff",
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  categoryButtonText: { color: "#020c10ff" },
  saveButton: {
    backgroundColor: "#00aaff",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  saveText: { color: "#1b0303ff", fontWeight: "700" },
  bottomNav: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  starContainer: { position: "absolute", top: 20, left: 20 },
  starLine: { flexDirection: "row", alignItems: "center", marginVertical: 3 },
  star: { color: "white", fontSize: 18 },
  blueLine: { width: 20, height: 3, backgroundColor: "#00aaff", marginLeft: 5 },
  mealCard: {
  backgroundColor: "#100a0aff",
  padding: 12,
  borderRadius: 10,
  marginVertical: 6,
  width: "90%",
},
mealDescription: {
  color: "#555",
  fontSize: 13,
  marginVertical: 4,
},
});
