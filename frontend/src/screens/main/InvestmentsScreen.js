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
} from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const InvestmentsScreen = ({ navigation }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [searchQuery, setSearchQuery] = useState('');

  const portfolioData = {
    totalValue: 50000,
    totalReturns: 2500,
    returnPercentage: 5.2,
    investments: [
      {
        id: 1,
        name: 'Axis Bluechip Fund',
        type: 'Mutual Fund',
        investedAmount: 25000,
        currentValue: 26250,
        returns: 1250,
        returnPercentage: 5,
        sipAmount: 5000,
        sipDate: '5th of every month',
      },
      {
        id: 2,
        name: 'HDFC Mid-Cap Fund',
        type: 'Mutual Fund',
        investedAmount: 15000,
        currentValue: 15750,
        returns: 750,
        returnPercentage: 5,
        sipAmount: 3000,
        sipDate: '10th of every month',
      },
      {
        id: 3,
        name: 'ICICI Prudential Technology Fund',
        type: 'Mutual Fund',
        investedAmount: 10000,
        currentValue: 8000,
        returns: -2000,
        returnPercentage: -20,
        sipAmount: 2000,
        sipDate: '15th of every month',
      },
    ],
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [45000, 47000, 46000, 48000, 49000, 50000],
      },
    ],
  };

  const renderPortfolioSummary = () => (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Portfolio Summary</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Value</Text>
          <Text style={styles.summaryValue}>₹{portfolioData.totalValue}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Returns</Text>
          <Text
            style={[
              styles.summaryValue,
              { color: portfolioData.totalReturns >= 0 ? 'green' : 'red' },
            ]}
          >
            ₹{portfolioData.totalReturns}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Returns %</Text>
          <Text
            style={[
              styles.summaryValue,
              { color: portfolioData.returnPercentage >= 0 ? 'green' : 'red' },
            ]}
          >
            {portfolioData.returnPercentage}%
          </Text>
        </View>
      </View>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 64}
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
  );

  const renderInvestmentsList = () => (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Your Investments</Text>
      {portfolioData.investments.map((investment) => (
        <React.Fragment key={investment.id}>
          <List.Item
            title={investment.name}
            description={`${investment.type} • SIP: ₹${investment.sipAmount}`}
            left={props => <List.Icon {...props} icon="chart-line" />}
            right={() => (
              <View style={styles.investmentRight}>
                <Text style={styles.investmentValue}>
                  ₹{investment.currentValue}
                </Text>
                <Text
                  style={[
                    styles.investmentReturns,
                    {
                      color: investment.returns >= 0 ? 'green' : 'red',
                    },
                  ]}
                >
                  {investment.returnPercentage}%
                </Text>
              </View>
            )}
          />
          <Divider />
        </React.Fragment>
      ))}
    </Surface>
  );

  const renderExploreFunds = () => (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Explore Funds</Text>
      <TextInput
        label="Search Funds"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        mode="outlined"
      />
      <List.Section>
        <List.Item
          title="Axis Bluechip Fund"
          description="Large Cap • 5Y Returns: 12.5%"
          left={props => <List.Icon {...props} icon="chart-line" />}
          right={props => (
            <Button
              {...props}
              mode="contained"
              onPress={() => navigation.navigate('FundDetails')}
            >
              Invest
            </Button>
          )}
        />
        <Divider />
        <List.Item
          title="HDFC Mid-Cap Fund"
          description="Mid Cap • 5Y Returns: 15.2%"
          left={props => <List.Icon {...props} icon="chart-line" />}
          right={props => (
            <Button
              {...props}
              mode="contained"
              onPress={() => navigation.navigate('FundDetails')}
            >
              Invest
            </Button>
          )}
        />
      </List.Section>
    </Surface>
  );

  return (
    <ScrollView style={styles.container}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'portfolio', label: 'Portfolio' },
          { value: 'explore', label: 'Explore' },
          { value: 'sip', label: 'SIP' },
        ]}
        style={styles.segmentedButtons}
      />

      {activeTab === 'portfolio' && (
        <>
          {renderPortfolioSummary()}
          {renderInvestmentsList()}
        </>
      )}

      {activeTab === 'explore' && renderExploreFunds()}

      {activeTab === 'sip' && (
        <Surface style={styles.surface}>
          <Text style={styles.title}>Start a New SIP</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('NewSIP')}
            style={styles.button}
          >
            Create New SIP
          </Button>
        </Surface>
      )}
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  investmentRight: {
    alignItems: 'flex-end',
  },
  investmentValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  investmentReturns: {
    fontSize: 14,
  },
  searchInput: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  segmentedButtons: {
    margin: 16,
  },
});

export default InvestmentsScreen; 