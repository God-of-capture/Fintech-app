import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Surface,
  Text,
  useTheme,
  TextInput,
  Button,
  IconButton,
  List,
  Divider,
} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';

const PaymentsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [note, setNote] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleSendMoney = async () => {
    if (!amount || !upiId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // Implement UPI payment logic here
      Alert.alert('Success', 'Payment initiated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment');
    }
  };

  const handleScanQR = () => {
    navigation.navigate('QRScanner');
  };

  const handleGenerateQR = () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter amount');
      return;
    }
    setShowQR(true);
  };

  const renderUPIForm = () => (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Send Money</Text>
      <TextInput
        label="UPI ID"
        value={upiId}
        onChangeText={setUpiId}
        style={styles.input}
        mode="outlined"
        placeholder="username@upi"
      />
      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        placeholder="₹0.00"
      />
      <TextInput
        label="Note (Optional)"
        value={note}
        onChangeText={setNote}
        style={styles.input}
        mode="outlined"
        placeholder="Add a note"
      />
      <Button
        mode="contained"
        onPress={handleSendMoney}
        style={styles.button}
      >
        Send Money
      </Button>
    </Surface>
  );

  const renderQRCode = () => (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Receive Money</Text>
      <View style={styles.qrContainer}>
        {showQR ? (
          <QRCode
            value={`upi://pay?pa=${user.phoneNumber}@upi&pn=${user.fullName}&am=${amount}&cu=INR`}
            size={200}
          />
        ) : (
          <Button
            mode="contained"
            onPress={handleGenerateQR}
            style={styles.button}
          >
            Generate QR Code
          </Button>
        )}
      </View>
      {showQR && (
        <Text style={styles.qrAmount}>Amount: ₹{amount}</Text>
      )}
    </Surface>
  );

  const renderQuickActions = () => (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('BillPayments')}
        >
          <IconButton icon="receipt" size={24} />
          <Text>Bill Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('Recharge')}
        >
          <IconButton icon="phone" size={24} />
          <Text>Recharge</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('DTH')}
        >
          <IconButton icon="television" size={24} />
          <Text>DTH</Text>
        </TouchableOpacity>
      </View>
    </Surface>
  );

  return (
    <ScrollView style={styles.container}>
      {renderUPIForm()}
      {renderQRCode()}
      {renderQuickActions()}

      <Surface style={styles.surface}>
        <Text style={styles.title}>Recent UPI IDs</Text>
        <List.Section>
          <List.Item
            title="John Doe"
            description="john.doe@upi"
            left={props => <List.Icon {...props} icon="account" />}
            right={props => (
              <IconButton
                {...props}
                icon="send"
                onPress={() => {
                  setUpiId('john.doe@upi');
                  navigation.navigate('SendMoney');
                }}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Jane Smith"
            description="jane.smith@upi"
            left={props => <List.Icon {...props} icon="account" />}
            right={props => (
              <IconButton
                {...props}
                icon="send"
                onPress={() => {
                  setUpiId('jane.smith@upi');
                  navigation.navigate('SendMoney');
                }}
              />
            )}
          />
        </List.Section>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrAmount: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  actionItem: {
    alignItems: 'center',
  },
});

export default PaymentsScreen; 