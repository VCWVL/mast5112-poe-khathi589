import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView, Modal, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ✅ User Interface
interface User {
  id: string;
  username: string;
  password: string;
  role: 'chef' | 'customer';
  name: string;
}

// ✅ Dish Interface
interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

// ✅ Order Interface
interface Order {
  id: string;
  items: Dish[];
  total: number;
  customerName: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  timestamp: Date;
}

// ✅ Cart Item Interface
interface CartItem {
  dish: Dish;
  quantity: number;
}

// ✅ Login Screen
function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users] = useState<User[]>([
    {
      id: '1',
      username: 'chef',
      password: 'chef123',
      role: 'chef',
      name: 'Master Chef'
    },
    {
      id: '2',
      username: 'customer',
      password: 'customer123',
      role: 'customer',
      name: 'John Doe'
    },
    {
      id: '3',
      username: 'admin',
      password: 'admin123',
      role: 'chef',
      name: 'Restaurant Admin'
    }
  ]);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      if (user.role === 'chef') {
        navigation.navigate('ChefHome', { user });
      } else {
        navigation.navigate('CustomerHome', { user });
      }
    } else {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  const quickLogin = (role: 'chef' | 'customer') => {
    const user = users.find(u => u.role === role);
    if (user) {
      if (role === 'chef') {
        navigation.navigate('ChefHome', { user });
      } else {
        navigation.navigate('CustomerHome', { user });
      }
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' }}
        style={styles.logo}
      />
      <Text style={styles.loginTitle}>🍽️ Timber Restaurant</Text>
      <Text style={styles.loginSubtitle}>Welcome Back!</Text>

      <View style={styles.loginForm}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.loginInput}
          placeholderTextColor="#A67B5B"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.loginInput}
          placeholderTextColor="#A67B5B"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.quickLoginContainer}>
          <Text style={styles.quickLoginText}>Quick Login:</Text>
          <View style={styles.quickLoginButtons}>
            <TouchableOpacity 
              style={[styles.quickButton, styles.quickChefButton]} 
              onPress={() => quickLogin('chef')}
            >
              <Text style={styles.quickButtonText}>👨‍🍳 Chef Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickButton, styles.quickCustomerButton]} 
              onPress={() => quickLogin('customer')}
            >
              <Text style={styles.quickButtonText}>👤 Customer Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.demoText}>
          Demo Credentials:{'\n'}
          👨‍🍳 Chef: chef / chef123{'\n'}
          👤 Customer: customer / customer123
        </Text>
      </View>
    </View>
  );
}

// ✅ Chef Home Screen
function ChefHomeScreen({ navigation, route }: any) {
  const { user } = route.params;
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);

  useEffect(() => {
    // Mock data
    const mockDishes: Dish[] = [
      {
        id: '1',
        name: 'Chicken Curry',
        price: 85,
        description: 'Spicy chicken curry with rice and naan bread',
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'
      },
      {
        id: '2',
        name: 'Beef Stew',
        price: 95,
        description: 'Tender beef with vegetables and mashed potatoes',
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=400'
      }
    ];

    const mockOrders: Order[] = [
      {
        id: '1',
        items: mockDishes,
        total: 180,
        customerName: 'John Doe',
        status: 'preparing',
        timestamp: new Date()
      },
      {
        id: '2',
        items: [mockDishes[0]],
        total: 85,
        customerName: 'Jane Smith',
        status: 'pending',
        timestamp: new Date()
      }
    ];

    setDishes(mockDishes);
    setOrders(mockOrders);
  }, []);

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.replace('Login') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chefHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
          <Text style={styles.roleText}>👨‍🍳 Head Chef</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Chef Dashboard</Text>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getOrdersByStatus('pending').length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{dishes.length}</Text>
          <Text style={styles.statLabel}>Dishes</Text>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.chefActions}>
        <TouchableOpacity style={styles.chefButton} onPress={() => navigation.navigate('Dishes')}>
          <Text style={styles.chefButtonText}>🍽️ Manage Dishes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chefButton} onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.chefButtonText}>📋 View All Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Order Management */}
      <Text style={styles.sectionTitle}>Order Management</Text>
      
      {/* Pending Orders */}
      <Text style={styles.subSectionTitle}>⏳ Pending Orders ({getOrdersByStatus('pending').length})</Text>
      {getOrdersByStatus('pending').map(order => (
        <View key={order.id} style={styles.orderCard}>
          <Text style={styles.orderTitle}>Order #{order.id} - {order.customerName}</Text>
          <Text style={styles.orderItems}>
            {order.items.map(item => item.name).join(', ')}
          </Text>
          <Text style={styles.orderTotal}>Total: R{order.total.toFixed(2)}</Text>
          <TouchableOpacity 
            style={styles.statusButton}
            onPress={() => updateOrderStatus(order.id, 'preparing')}
          >
            <Text style={styles.statusButtonText}>Start Preparing</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Preparing Orders */}
      <Text style={styles.subSectionTitle}>👨‍🍳 Preparing Orders ({getOrdersByStatus('preparing').length})</Text>
      {getOrdersByStatus('preparing').map(order => (
        <View key={order.id} style={styles.orderCard}>
          <Text style={styles.orderTitle}>Order #{order.id} - {order.customerName}</Text>
          <Text style={styles.orderItems}>
            {order.items.map(item => item.name).join(', ')}
          </Text>
          <TouchableOpacity 
            style={[styles.statusButton, styles.readyButton]}
            onPress={() => updateOrderStatus(order.id, 'ready')}
          >
            <Text style={styles.statusButtonText}>Mark as Ready</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Ready Orders */}
      <Text style={styles.subSectionTitle}>✅ Ready for Pickup ({getOrdersByStatus('ready').length})</Text>
      {getOrdersByStatus('ready').map(order => (
        <View key={order.id} style={styles.orderCard}>
          <Text style={styles.orderTitle}>Order #{order.id} - {order.customerName}</Text>
          <Text style={styles.orderItems}>
            {order.items.map(item => item.name).join(', ')}
          </Text>
          <TouchableOpacity 
            style={[styles.statusButton, styles.completeButton]}
            onPress={() => updateOrderStatus(order.id, 'completed')}
          >
            <Text style={styles.statusButtonText}>Mark as Completed</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

// ✅ Customer Home Screen
function CustomerHomeScreen({ navigation, route }: any) {
  const { user, cart: initialCart } = route.params || {};
  const [cart, setCart] = useState<CartItem[]>(initialCart || []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.replace('Login') }
      ]
    );
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.customerHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
          <Text style={styles.roleText}>👤 Valued Customer</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' }}
        style={styles.restaurantImage}
      />

      <Text style={styles.title}>Timber Restaurant</Text>
      <Text style={styles.subtitle}>Fine Dining Experience</Text>

      <View style={styles.customerActions}>
        <TouchableOpacity style={styles.customerButton} onPress={() => navigation.navigate('Menu')}>
          <Text style={styles.customerButtonText}>📋 Browse Menu</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.customerButton} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.customerButtonText}>
            🛒 View Cart {getCartItemCount() > 0 && `(${getCartItemCount()})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.customerButton} onPress={() => navigation.navigate('CustomerOrders')}>
          <Text style={styles.customerButtonText}>📦 My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.customerButton} onPress={() => navigation.navigate('TableBooking')}>
          <Text style={styles.customerButtonText}>🪑 Book a Table</Text>
        </TouchableOpacity>
      </View>

      {/* Special Offers */}
      <View style={styles.offersContainer}>
        <Text style={styles.offersTitle}>🎉 Today's Specials</Text>
        <View style={styles.offerCard}>
          <Text style={styles.offerText}>🍛 Chicken Curry - 15% OFF</Text>
          <Text style={styles.offerDescription}>Only R72.25 today!</Text>
        </View>
        <View style={styles.offerCard}>
          <Text style={styles.offerText}>🎂 Free Dessert</Text>
          <Text style={styles.offerDescription}>With every order over R150</Text>
        </View>
      </View>
    </View>
  );
}

// ✅ Customer Orders Screen
function CustomerOrdersScreen({ route }: any) {
  const { user } = route.params;
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        items: [
          {
            id: '1',
            name: 'Chicken Curry',
            price: 85,
            description: 'Spicy chicken curry with rice and naan bread',
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'
          }
        ],
        total: 85,
        customerName: user.name,
        status: 'completed',
        timestamp: new Date('2024-01-15')
      },
      {
        id: '2',
        items: [
          {
            id: '1',
            name: 'Chicken Curry',
            price: 85,
            description: 'Spicy chicken curry with rice and naan bread',
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'
          },
          {
            id: '6',
            name: 'Chocolate Lava Cake',
            price: 35,
            description: 'Warm chocolate cake with molten center and ice cream',
            category: 'Desserts',
            image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400'
          }
        ],
        total: 120,
        customerName: user.name,
        status: 'preparing',
        timestamp: new Date()
      }
    ];
    setOrders(mockOrders);
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'preparing': return '#4169E1';
      case 'ready': return '#32CD32';
      case 'completed': return '#808080';
      default: return '#666';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '⏳ Pending';
      case 'preparing': return '👨‍🍳 Preparing';
      case 'ready': return '✅ Ready for Pickup';
      case 'completed': return '📦 Completed';
      default: return status;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      
      {orders.map(order => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>Order #{order.id}</Text>
            <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
              {getStatusText(order.status)}
            </Text>
          </View>
          
          <Text style={styles.orderDate}>
            {order.timestamp.toLocaleDateString()} at {order.timestamp.toLocaleTimeString()}
          </Text>
          
          {order.items.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>{item.name}</Text>
              <Text style={styles.orderItemPrice}>R{item.price.toFixed(2)}</Text>
            </View>
          ))}
          
          <Text style={styles.orderTotal}>Total: R{order.total.toFixed(2)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// ✅ Table Booking Screen (Placeholder)
function TableBookingScreen({ route }: any) {
  const { user } = route.params;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Table Booking</Text>
      <Text style={styles.subtitle}>Coming Soon!</Text>
      <Text style={styles.bookingText}>
        Dear {user.name},{'\n\n'}
        Our table booking system is currently under development.{'\n\n'}
        Please call us at (021) 123-4567 to make a reservation.
      </Text>
    </View>
  );
}

// ✅ Menu Browser Screen (Updated with user context)
function MenuScreen({ navigation, route }: any) {
  const { user, cart: initialCart } = route.params || {};
  const [dishes] = useState<Dish[]>([
    // ... (same dishes array as before)
    {
      id: '1',
      name: 'Chicken Curry',
      price: 85,
      description: 'Spicy chicken curry with rice and naan bread',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'
    },
    {
      id: '2',
      name: 'Beef Stew',
      price: 95,
      description: 'Tender beef with vegetables and mashed potatoes',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=400'
    },
    {
      id: '3',
      name: 'Fish & Chips',
      price: 70,
      description: 'Crispy fish with fries and tartar sauce',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1579208025658-87c5c0d625b9?w=400'
    },
    {
      id: '4',
      name: 'Caesar Salad',
      price: 45,
      description: 'Fresh romaine lettuce with Caesar dressing and croutons',
      category: 'Starters',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'
    },
    {
      id: '5',
      name: 'Garlic Bread',
      price: 25,
      description: 'Toasted bread with garlic butter and herbs',
      category: 'Starters',
      image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400'
    },
    {
      id: '6',
      name: 'Chocolate Lava Cake',
      price: 35,
      description: 'Warm chocolate cake with molten center and ice cream',
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400'
    },
    {
      id: '7',
      name: 'Pancake Stack',
      price: 55,
      description: 'Fluffy pancakes with maple syrup and fresh berries',
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400'
    },
    {
      id: '8',
      name: 'Avocado Toast',
      price: 40,
      description: 'Sourdough toast with smashed avocado and poached eggs',
      category: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400'
    }
  ]);

  const [cart, setCart] = useState<CartItem[]>(initialCart || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Calculate average price per category
  const getAveragePriceByCategory = (category: string): number => {
    const categoryDishes = dishes.filter(dish => dish.category === category);
    if (categoryDishes.length === 0) return 0;
    const total = categoryDishes.reduce((sum, dish) => sum + dish.price, 0);
    return total / categoryDishes.length;
  };

  const categories = ['All', ...new Set(dishes.map(dish => dish.category))];
  const filteredDishes = selectedCategory === 'All' 
    ? dishes 
    : dishes.filter(dish => dish.category === selectedCategory);

  const addToCart = (dish: Dish) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.dish.id === dish.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { dish, quantity: 1 }];
      }
    });
    Alert.alert('Added to Cart', `${dish.name} has been added to your cart!`);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.dish.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📋 Our Menu</Text>
          {user && <Text style={styles.userWelcome}>Welcome, {user.name}!</Text>}
        </View>
        <TouchableOpacity style={styles.cartIcon} onPress={() => navigation.navigate('Cart', { user, cart })}>
          <Text style={styles.cartIconText}>🛒 {getCartItemCount()}</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonSelected
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextSelected
            ]}>
              {category}
            </Text>
            {category !== 'All' && (
              <Text style={styles.averagePrice}>
                Avg: R{getAveragePriceByCategory(category).toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <FlatList
        data={filteredDishes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.dishImage} />
            <View style={styles.dishInfo}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishCategory}>{item.category}</Text>
              <Text style={styles.dishDescription}>{item.description}</Text>
              <Text style={styles.dishPrice}>R{item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
              <Text style={styles.addToCartButtonText}>Add +</Text>
            </TouchableOpacity>
          </View>
        )}
        style={styles.menuList}
      />

      {/* Cart Summary */}
      {cart.length > 0 && (
        <View style={styles.cartSummary}>
          <Text style={styles.cartSummaryText}>
            Cart: {getCartItemCount()} items • R{getCartTotal().toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.viewCartButton} onPress={() => navigation.navigate('Cart', { user, cart })}>
            <Text style={styles.viewCartButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ✅ Cart Screen (Updated with user context)
function CartScreen({ navigation, route }: any) {
  const { user, cart: initialCart } = route.params || {};
  const [cart, setCart] = useState<CartItem[]>(initialCart || []);

  const updateQuantity = (dishId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.dish.id !== dishId));
    } else {
      setCart(cart.map(item =>
        item.dish.id === dishId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.dish.price * item.quantity), 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart before placing an order.');
      return;
    }

    Alert.alert(
      'Order Placed!',
      `Thank you ${user.name}! Your order of R${getCartTotal().toFixed(2)} has been placed successfully!`,
      [{ text: 'OK', onPress: () => navigation.navigate('CustomerHome', { user, cart: [] }) }]
    );
    setCart([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Your Cart</Text>
      {user && <Text style={styles.userWelcome}>Order for: {user.name}</Text>}

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Menu', { user, cart: [] })}>
            <Text style={styles.buttonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={item => item.dish.id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.dish.image }} style={styles.cartItemImage} />
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.dish.name}</Text>
                  <Text style={styles.cartItemPrice}>R{item.dish.price.toFixed(2)} each</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={() => updateQuantity(item.dish.id, item.quantity - 1)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={() => updateQuantity(item.dish.id, item.quantity + 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.cartItemTotal}>
                  R{(item.dish.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            )}
          />

          <View style={styles.cartTotal}>
            <Text style={styles.cartTotalText}>Total: R{getCartTotal().toFixed(2)}</Text>
            <TouchableOpacity style={styles.placeOrderButton} onPress={placeOrder}>
              <Text style={styles.placeOrderButtonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

// ✅ Dishes Management Screen
function DishesScreen({ navigation, route }: any) {
  const { user } = route.params;
  const [dishes, setDishes] = useState<Dish[]>([
    {
      id: '1',
      name: 'Chicken Curry',
      price: 85,
      description: 'Spicy chicken curry with rice and naan bread',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'
    },
    {
      id: '2',
      name: 'Beef Stew',
      price: 95,
      description: 'Tender beef with vegetables and mashed potatoes',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=400'
    }
  ]);

  const [newDish, setNewDish] = useState<Partial<Dish>>({
    name: '',
    price: 0,
    description: '',
    category: '',
    image: ''
  });

  const [isAdding, setIsAdding] = useState(false);

  const addDish = () => {
    if (!newDish.name || !newDish.price || !newDish.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const dish: Dish = {
      id: Date.now().toString(),
      name: newDish.name!,
      price: newDish.price!,
      description: newDish.description || '',
      category: newDish.category!,
      image: newDish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
    };

    setDishes([...dishes, dish]);
    setNewDish({ name: '', price: 0, description: '', category: '', image: '' });
    setIsAdding(false);
    Alert.alert('Success', 'Dish added successfully!');
  };

  const deleteDish = (dishId: string) => {
    Alert.alert(
      'Delete Dish',
      'Are you sure you want to delete this dish?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => setDishes(dishes.filter(d => d.id !== dishId)) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Dishes</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsAdding(!isAdding)}
      >
        <Text style={styles.buttonText}>{isAdding ? 'Cancel' : '+ Add New Dish'}</Text>
      </TouchableOpacity>

      {isAdding && (
        <View style={styles.orderCard}>
          <TextInput
            placeholder="Dish Name"
            value={newDish.name}
            onChangeText={(text) => setNewDish({ ...newDish, name: text })}
            style={styles.loginInput}
          />
          <TextInput
            placeholder="Price"
            value={newDish.price?.toString()}
            onChangeText={(text) => setNewDish({ ...newDish, price: parseFloat(text) || 0 })}
            keyboardType="numeric"
            style={styles.loginInput}
          />
          <TextInput
            placeholder="Category"
            value={newDish.category}
            onChangeText={(text) => setNewDish({ ...newDish, category: text })}
            style={styles.loginInput}
          />
          <TextInput
            placeholder="Description"
            value={newDish.description}
            onChangeText={(text) => setNewDish({ ...newDish, description: text })}
            style={styles.loginInput}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={addDish}>
            <Text style={styles.buttonText}>Add Dish</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={dishes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.dishImage} />
            <View style={styles.dishInfo}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishCategory}>{item.category}</Text>
              <Text style={styles.dishDescription}>{item.description}</Text>
              <Text style={styles.dishPrice}>R{item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: '#B71C1C' }]}
              onPress={() => deleteDish(item.id)}
            >
              <Text style={styles.quantityButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// ✅ Orders Screen
function OrdersScreen({ navigation, route }: any) {
  const { user } = route.params;
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      items: [
        {
          id: '1',
          name: 'Chicken Curry',
          price: 85,
          description: 'Spicy chicken curry with rice and naan bread',
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'
        }
      ],
      total: 85,
      customerName: 'John Doe',
      status: 'pending',
      timestamp: new Date()
    },
    {
      id: '2',
      items: [
        {
          id: '2',
          name: 'Beef Stew',
          price: 95,
          description: 'Tender beef with vegetables and mashed potatoes',
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=400'
        }
      ],
      total: 95,
      customerName: 'Jane Smith',
      status: 'preparing',
      timestamp: new Date()
    }
  ]);

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'preparing': return '#4169E1';
      case 'ready': return '#32CD32';
      case 'completed': return '#808080';
      default: return '#666';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '⏳ Pending';
      case 'preparing': return '👨‍🍳 Preparing';
      case 'ready': return '✅ Ready for Pickup';
      case 'completed': return '📦 Completed';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item: order }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderTitle}>Order #{order.id} - {order.customerName}</Text>
              <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
                {getStatusText(order.status)}
              </Text>
            </View>

            <Text style={styles.orderDate}>
              {order.timestamp.toLocaleDateString()} at {order.timestamp.toLocaleTimeString()}
            </Text>

            {order.items.map(item => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemPrice}>R{item.price.toFixed(2)}</Text>
              </View>
            ))}

            <Text style={styles.orderTotal}>Total: R{order.total.toFixed(2)}</Text>

            {order.status === 'pending' && (
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => updateOrderStatus(order.id, 'preparing')}
              >
                <Text style={styles.statusButtonText}>Start Preparing</Text>
              </TouchableOpacity>
            )}

            {order.status === 'preparing' && (
              <TouchableOpacity
                style={[styles.statusButton, styles.readyButton]}
                onPress={() => updateOrderStatus(order.id, 'ready')}
              >
                <Text style={styles.statusButtonText}>Mark as Ready</Text>
              </TouchableOpacity>
            )}

            {order.status === 'ready' && (
              <TouchableOpacity
                style={[styles.statusButton, styles.completeButton]}
                onPress={() => updateOrderStatus(order.id, 'completed')}
              >
                <Text style={styles.statusButtonText}>Mark as Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

// ✅ Stack Navigation (Updated with new screens)
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#8B4513' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChefHome" component={ChefHomeScreen} options={{ title: 'Chef Dashboard' }} />
        <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} options={{ title: 'Welcome' }} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Our Menu' }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Shopping Cart' }} />
        <Stack.Screen name="CustomerOrders" component={CustomerOrdersScreen} options={{ title: 'My Orders' }} />
        <Stack.Screen name="TableBooking" component={TableBookingScreen} options={{ title: 'Book a Table' }} />
        <Stack.Screen name="Dishes" component={DishesScreen} options={{ title: 'Manage Dishes' }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'All Orders' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ✅ Enhanced Styles (Add these new styles)
const styles = StyleSheet.create({
  // Basic Styles
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6D4C41',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D2691E',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E342E',
    marginBottom: 5,
  },
  orderItems: {
    fontSize: 14,
    color: '#6D4C41',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },

  // Login Styles
  loginContainer: {
    flex: 1,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F5DEB3',
    textAlign: 'center',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 18,
    color: '#DEB887',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginForm: {
    backgroundColor: '#FFF8E1',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginInput: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: '#D2691E',
    borderWidth: 1,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#D2691E',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  quickLoginContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  quickLoginText: {
    textAlign: 'center',
    color: '#4E342E',
    marginBottom: 10,
    fontWeight: '600',
  },
  quickLoginButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickChefButton: {
    backgroundColor: '#8B4513',
  },
  quickCustomerButton: {
    backgroundColor: '#D2691E',
  },
  quickButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  demoText: {
    textAlign: 'center',
    color: '#6D4C41',
    marginTop: 20,
    fontSize: 12,
    lineHeight: 18,
  },

  // Chef Styles
  chefHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E342E',
  },
  roleText: {
    fontSize: 14,
    color: '#6D4C41',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#B71C1C',
    padding: 10,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFE0B2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  statLabel: {
    fontSize: 12,
    color: '#6D4C41',
    marginTop: 4,
  },
  chefActions: {
    marginBottom: 20,
  },
  chefButton: {
    backgroundColor: '#8B4513',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  chefButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4E342E',
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6D4C41',
    marginTop: 15,
    marginBottom: 8,
  },
  statusButton: {
    backgroundColor: '#D2691E',
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  statusButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  readyButton: {
    backgroundColor: '#228B22',
  },
  completeButton: {
    backgroundColor: '#666',
  },

  // Customer Styles
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 15,
  },
  customerActions: {
    marginBottom: 20,
  },
  customerButton: {
    backgroundColor: '#D2691E',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  customerButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  offersContainer: {
    backgroundColor: '#FFE0B2',
    padding: 15,
    borderRadius: 8,
  },
  offersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E342E',
    marginBottom: 10,
  },
  offerCard: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  offerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  offerDescription: {
    fontSize: 12,
    color: '#6D4C41',
  },

  // Order Styles
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderItemName: {
    fontSize: 14,
    color: '#5D4037',
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#5D4037',
    fontWeight: '600',
  },

  // Table Booking
  bookingText: {
    fontSize: 16,
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 20,
  },

  // User Welcome
  userWelcome: {
    fontSize: 14,
    color: '#6D4C41',
    textAlign: 'center',
    marginBottom: 10,
  },

  // Logo Style
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cartIcon: {
    backgroundColor: '#D2691E',
    padding: 10,
    borderRadius: 20,
  },
  cartIconText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Category Styles
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#D2691E',
  },
  categoryButtonSelected: {
    backgroundColor: '#D2691E',
  },
  categoryButtonText: {
    color: '#D2691E',
    fontWeight: 'bold',
  },
  categoryButtonTextSelected: {
    color: '#FFF',
  },
  averagePrice: {
    fontSize: 10,
    color: '#6D4C41',
    marginTop: 2,
  },

  // Menu Styles
  menuItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  dishInfo: {
    flex: 1,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E342E',
    marginBottom: 5,
  },
  dishCategory: {
    fontSize: 12,
    color: '#6D4C41',
    marginBottom: 5,
  },
  dishDescription: {
    fontSize: 14,
    color: '#5D4037',
    marginBottom: 5,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  addToCartButton: {
    backgroundColor: '#D2691E',
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  addToCartButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  menuList: {
    flex: 1,
  },

  // Cart Styles
  cartSummary: {
    backgroundColor: '#FFE0B2',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartSummaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  viewCartButton: {
    backgroundColor: '#8B4513',
    padding: 10,
    borderRadius: 6,
  },
  viewCartButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#6D4C41',
    marginBottom: 20,
  },
  cartItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 15,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E342E',
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#6D4C41',
    marginBottom: 5,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#D2691E',
    padding: 5,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4E342E',
    minWidth: 30,
    textAlign: 'center',
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'right',
  },
  cartTotal: {
    backgroundColor: '#FFE0B2',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  placeOrderButton: {
    backgroundColor: '#228B22',
    padding: 15,
    borderRadius: 8,
  },
  placeOrderButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
