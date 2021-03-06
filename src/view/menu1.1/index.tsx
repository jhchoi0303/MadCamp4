import React from "react";
import Layout from "../../component/layout";
import { STATIC_URL } from "../../constants";
import BeatItem from "../../component/beatmaker";
import * as S from "./styles";
import AudioHeader from "../../component/audio-header";
const Menu11: React.FC = () => {
  return (
    <Layout>
      <S.Main>
        <AudioHeader></AudioHeader>
        <S.Section>
          <BeatItem></BeatItem>
        </S.Section>
      </S.Main>
    </Layout>
  );
};

export default Menu11;
