import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Surface,
  Text,
  useTheme,
  Card,
  Button,
  IconButton,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = React.useState(false);
  const [walletBalance, setWalletBalance] = React.useState(0);
  const [recentTransactions, setRecentTransactions] = React.useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Implement refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Fetch wallet balance and recent transactions
    // This would typically be done through an API call
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const renderTransactionItem = (transaction) => (
    <Card key={transaction.id} style={styles.transactionCard}>
      <Card.Content style={styles.transactionContent}>
        <View style={styles.transactionLeft}>
          <IconButton
            icon={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
            size={24}
            iconColor={transaction.type === 'credit' ? 'green' : 'red'}
          />
          <View>
            <Text style={styles.transactionTitle}>{transaction.title}</Text>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            {
              color: transaction.type === 'credit' ? 'green' : 'red',
            },
          ]}
        >
          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Wallet Balance Card */}
      <Surface style={styles.walletCard}>
        <Text style={styles.walletTitle}>Wallet Balance</Text>
        <Text style={styles.walletAmount}>₹{walletBalance.toFixed(2)}</Text>
        <View style={styles.walletActions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AddMoney')}
            style={styles.walletButton}
          >
            Add Money
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('WithdrawMoney')}
            style={styles.walletButton}
          >
            Withdraw
          </Button>
        </View>
      </Surface>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('SendMoney')}
          style={styles.actionButton}
          icon="send"
        >
          Send
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ReceiveMoney')}
          style={styles.actionButton}
          icon="qrcode-scan"
        >
          Receive
        </Button>
      </View>

      {/* Investment Chart */}
      <Surface style={styles.chartCard}>
        <Text style={styles.chartTitle}>Investment Growth</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </Surface>

      {/* Recent Transactions */}
      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {recentTransactions.map(renderTransactionItem)}
        <Button
          mode="text"
          onPress={() => navigation.navigate('TransactionHistory')}
          style={styles.viewAllButton}
        >
          View All Transactions
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  walletCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  walletTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  walletActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  walletButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  chartCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  transactionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionCard: {
    marginBottom: 8,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllButton: {
    marginTop: 16,
  },
});

export default HomeScreen; 