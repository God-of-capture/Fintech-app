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
  Button,
  List,
  Divider,
  TextInput,
  SegmentedButtons,
  ProgressBar,
} from 'react-native-paper';
import { useSelector } from 'react-redux';

const P2PScreen = ({ navigation }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('lend');
  const { user } = useSelector((state) => state.auth);

  const lendingOpportunities = [
    {
      id: 1,
      borrowerName: 'John Doe',
      amount: 50000,
      interestRate: 12,
      tenure: 12,
      creditScore: 750,
      purpose: 'Home Renovation',
      riskLevel: 'Low',
      progress: 0.75,
    },
    {
      id: 2,
      borrowerName: 'Jane Smith',
      amount: 25000,
      interestRate: 15,
      tenure: 6,
      creditScore: 680,
      purpose: 'Business Expansion',
      riskLevel: 'Medium',
      progress: 0.45,
    },
  ];

  const activeLoans = [
    {
      id: 1,
      borrowerName: 'Mike Johnson',
      amount: 100000,
      interestRate: 10,
      tenure: 24,
      emiAmount: 4614,
      nextPaymentDate: '2024-04-15',
      status: 'Active',
    },
    {
      id: 2,
      borrowerName: 'Sarah Williams',
      amount: 75000,
      interestRate: 11,
      tenure: 18,
      emiAmount: 4567,
      nextPaymentDate: '2024-04-20',
      status: 'Active',
    },
  ];

  const renderLendingOpportunities = () => (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Lending Opportunities</Text>
      {lendingOpportunities.map((opportunity) => (
        <React.Fragment key={opportunity.id}>
          <List.Item
            title={opportunity.borrowerName}
            description={`₹${opportunity.amount} • ${opportunity.interestRate}% • ${opportunity.tenure} months`}
            left={props => <List.Icon {...props} icon="account" />}
            right={() => (
              <View style={styles.opportunityRight}>
                <Text style={styles.creditScore}>
                  Score: {opportunity.creditScore}
                </Text>
                <Text style={styles.riskLevel}>{opportunity.riskLevel}</Text>
              </View>
            )}
          />
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {Math.round(opportunity.progress * 100)}% Funded
            </Text>
            <ProgressBar
              progress={opportunity.progress}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
          </View>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('LendDetails', { opportunity })}
            style={styles.actionButton}
          >
            Lend Now
          </Button>
          <Divider />
        </React.Fragment>
      ))}
    </Surface>
  );

  const renderActiveLoans = () => (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Active Loans</Text>
      {activeLoans.map((loan) => (
        <React.Fragment key={loan.id}>
          <List.Item
            title={loan.borrowerName}
            description={`EMI: ₹${loan.emiAmount} • Next Payment: ${loan.nextPaymentDate}`}
            left={props => <List.Icon {...props} icon="cash" />}
            right={() => (
              <View style={styles.loanRight}>
                <Text style={styles.loanAmount}>₹{loan.amount}</Text>
                <Text style={styles.loanStatus}>{loan.status}</Text>
              </View>
            )}
          />
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('LoanDetails', { loan })}
            style={styles.actionButton}
          >
            View Details
          </Button>
          <Divider />
        </React.Fragment>
      ))}
    </Surface>
  );

  const renderBorrowSection = () => (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Borrow Money</Text>
      <Text style={styles.subtitle}>Get quick loans at competitive rates</Text>
      
      <View style={styles.creditScoreContainer}>
        <Text style={styles.creditScoreTitle}>Your Credit Score</Text>
        <Text style={styles.creditScoreValue}>750</Text>
        <Text style={styles.creditScoreSubtitle}>Good</Text>
      </View>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('NewLoan')}
        style={styles.button}
      >
        Apply for a Loan
      </Button>

      <View style={styles.loanCalculator}>
        <Text style={styles.calculatorTitle}>Loan Calculator</Text>
        <TextInput
          label="Loan Amount"
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Tenure (months)"
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />
        <Button
          mode="contained"
          onPress={() => navigation.navigate('LoanCalculator')}
          style={styles.button}
        >
          Calculate EMI
        </Button>
      </View>
    </Surface>
  );

  return (
    <ScrollView style={styles.container}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'lend', label: 'Lend' },
          { value: 'borrow', label: 'Borrow' },
          { value: 'loans', label: 'My Loans' },
        ]}
        style={styles.segmentedButtons}
      />

      {activeTab === 'lend' && renderLendingOpportunities()}
      {activeTab === 'borrow' && renderBorrowSection()}
      {activeTab === 'loans' && renderActiveLoans()}
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  opportunityRight: {
    alignItems: 'flex-end',
  },
  creditScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  riskLevel: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressText: {
    fontSize: 12,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  actionButton: {
    marginTop: 8,
  },
  loanRight: {
    alignItems: 'flex-end',
  },
  loanAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loanStatus: {
    fontSize: 12,
    color: '#666',
  },
  creditScoreContainer: {
    alignItems: 'center',
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  creditScoreTitle: {
    fontSize: 16,
    color: '#666',
  },
  creditScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  creditScoreSubtitle: {
    fontSize: 14,
    color: '#4CAF50',
  },
  loanCalculator: {
    marginTop: 16,
  },
  calculatorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  segmentedButtons: {
    margin: 16,
  },
});

export default P2PScreen; 