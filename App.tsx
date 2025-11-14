import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ✅ Dish Interface
interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
}

// ✅ Order Interface
interface Order {
  id: string;
  items: Dish[];
  total: number;
}

// ✅ Home Screen
function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Restaurant Management App</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Dishes')}>
        <Text style={styles.buttonText}>Manage Dishes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Orders')}>
        <Text style={styles.buttonText}>View Orders</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Dishes Management Screen
function DishesScreen() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const addDish = () => {
    if (!name || !price) {
      Alert.alert('Error', 'Please enter dish name and price.');
      return;
    }

    const newDish: Dish = {
      id: editingDish ? editingDish.id : Math.random().toString(),
      name,
      price: parseFloat(price),
      description,
    };

    if (editingDish) {
      setDishes(dishes.map(d => (d.id === editingDish.id ? newDish : d)));
      setEditingDish(null);
    } else {
      setDishes([...dishes, newDish]);
    }

    setName('');
    setPrice('');
    setDescription('');
  };

  const editDish = (dish: Dish) => {
    setEditingDish(dish);
    setName(dish.name);
    setPrice(dish.price.toString());
    setDescription(dish.description);
  };

  const deleteDish = (id: string) => {
    setDishes(dishes.filter(dish => dish.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🍛 Manage Dishes</Text>

      <TextInput
        placeholder="Dish Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Price (ZAR)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={addDish}>
        <Text style={styles.buttonText}>
          {editingDish ? 'Update Dish' : 'Add Dish'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={dishes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.dishItem}>
            <Text style={styles.dishName}>{item.name}</Text>
            <Text style={styles.dishPrice}>R{item.price.toFixed(2)}</Text>
            <Text style={styles.dishDescription}>{item.description}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={() => editDish(item)}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteDish(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

// ✅ Orders Screen
function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Mock Orders
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        items: [
          { id: 'a', name: 'Chicken Curry', price: 85, description: 'Spicy chicken curry with rice' },
          { id: 'b', name: 'Beef Stew', price: 95, description: 'Tender beef with vegetables' },
        ],
        total: 180,
      },
      {
        id: '2',
        items: [
          { id: 'c', name: 'Fish & Chips', price: 70, description: 'Crispy fish with fries' },
        ],
        total: 70,
      },
    ];
    setOrders(mockOrders);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧾 Orders</Text>
      {orders.map(order => (
        <View key={order.id} style={styles.orderCard}>
          <Text style={styles.orderTitle}>Order #{order.id}</Text>
          {order.items.map(item => (
            <Text key={item.id} style={styles.orderItem}>
              {item.name} — R{item.price.toFixed(2)}
            </Text>
          ))}
          <Text style={styles.orderTotal}>Total: R{order.total.toFixed(2)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// ✅ Stack Navigation
const Stack = createStackNavigator();

// ✅ App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#8B4513' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="Dishes" component={DishesScreen} options={{ title: 'Manage Dishes' }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Orders' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8E1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E342E',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    borderColor: '#D7CCC8',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#8B4513',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dishItem: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    borderColor: '#FFCC80',
    borderWidth: 1,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E342E',
  },
  dishPrice: {
    fontSize: 16,
    color: '#6D4C41',
  },
  dishDescription: {
    fontSize: 14,
    color: '#5D4037',
    marginVertical: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  editButton: {
    backgroundColor: '#D2691E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#B71C1C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: '#FFE0B2',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  orderTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#4E342E',
  },
  orderItem: {
    fontSize: 14,
    color: '#5D4037',
  },
  orderTotal: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 6,
    color: '#3E2723',
  },
});
