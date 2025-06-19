import React from 'react';
import styled from 'styled-components/native';

interface Props {
  accountName: string;
  balance: number;
}

const Card = styled.View`
  background-color: #f1f3f5;
  padding: 20px;
  border-radius: 16px;
`;

const AccountName = styled.Text`
  font-size: 18px;
  color: #333;
`;

const Balance = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #1e88e5;
  margin-top: 8px;
`;

export default function AccountCard({ accountName, balance }: Props) {
  return (
    <Card>
      <AccountName>{accountName}</AccountName>
      <Balance>{balance.toLocaleString()} 원</Balance>
    </Card>
  );
}
