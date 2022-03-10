import { AdMobInterstitial } from "expo-ads-admob";
import React, { useEffect, useState } from "react";
import { Alert, DatePickerIOSBase } from "react-native";
import styled from "styled-components";
import colors from "../colors";
import { useDB } from "../context";

const View = styled.View`
  background-color: ${colors.bgColor};
  flex: 1;
  padding: 0px 20px;
`;

const Title = styled.Text`
  color: ${colors.textColor};
  margin: 50px 0px;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
`;

const TextInput = styled.TextInput`
  background-color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 18px;
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
`;

const Btn = styled.TouchableOpacity`
  width: 100%;
  margin-top: 30px;
  background-color: ${colors.btnColor};
  padding: 10px 20px;
  align-items: center;
  border-radius: 20px;
`;

const BtnText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 500;
`;
const Emotions = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
  justify-content: space-between;
`;

const Emotion = styled.TouchableOpacity`
  background-color: white;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 10px;
  border-width: ${(props) => (props.selected ? "2px" : "0px")};
`;

const EmotionText = styled.Text`
  font-size: 24px;
`;

const emotions = ["😀", "😱", "😂", "😕", "😍"];

const Write = ({ navigation: { goBack } }) => {
  const realm = useDB();

  const [selectedEmotion, setEmotion] = useState(null);
  const [feelings, setFeelings] = useState(null);
  const onChangeText = (text) => {
    setFeelings(text);
  };
  const onEmotionPress = (face) => {
    setEmotion(face);
  };
  const onSubmit = async () => {
    if (feelings === "" || selectedEmotion === null) {
      return Alert.alert("complete form");
    }
    realm.write(() => {
      realm.create("Feeling", {
        _id: Date.now(),
        emotion: selectedEmotion,
        message: feelings,
      });
    });
    // goBack();
    await AdMobInterstitial.setAdUnitID(
      "ca-app-pub-3940256099942544/4411468910"
    );
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
  };
  return (
    <View>
      <Title>hellllllo world</Title>
      <Emotions>
        {emotions.map((emotion, index) => (
          <Emotion
            selected={emotion === selectedEmotion}
            onPress={() => onEmotionPress(emotion)}
            key={index}
          >
            <EmotionText>{emotion}</EmotionText>
          </Emotion>
        ))}
      </Emotions>
      <TextInput
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        onChangeText={onChangeText}
        value={feelings}
        placeholder="How do you feel?"
        placeholderTextColor="lightgrey"
      />
      <Btn onPress={onSubmit}>
        <BtnText>Save</BtnText>
      </Btn>
    </View>
  );
};

export default Write;
