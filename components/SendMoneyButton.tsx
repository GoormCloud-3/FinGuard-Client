import React from 'react';
import styled from 'styled-components/native';

interface Props {
  onPress: () => void;
}

const Button = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

export default function SendMoneyButton({ onPress }: Props) {
  return (
    <Button onPress={onPress}>
      <ButtonText>송금</ButtonText>
    </Button>
  );
}
