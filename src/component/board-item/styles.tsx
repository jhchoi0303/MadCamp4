import styled from "styled-components/macro";
import { Link } from "react-router-dom";

import { THEME_COLOR } from "../../constants";

export const BoardItem = styled.li`
  width: 100%;
  height: 15rem;
  border-top: 1px solid ${THEME_COLOR.GRAY};
  &:hover {
    background-color: ${THEME_COLOR.GRAY};
  }
  transition: background-color 0.5s;
  margin-bottom: 1rem;
`;

export const BoardItemContainer = styled(Link)`
  width: 100%;
  height: 100%;
  padding: 1rem;
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const BoardItemTitle = styled.div`
  padding-top: 0.5rem;
  padding-left: 2rem;
  font-size: 1.7rem;
  letter-spacing: 1px; /* for bettter reading experience */
`;

export const BoardItemMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 2rem;
`;

export const BoardItemContent = styled.div`
  display: flex;
  flex-direction: row;
`;

export const BoardItemMetaLeft = styled.div``;

export const BoardItemMetaRight = styled.div``;

export const BoardItemImage = styled.div`
  height: 8rem;
  width: 8rem;
  margin: 2rem;
  border: 0.1rem solid;
  background-image: url("https://cdn.pixabay.com/photo/2019/03/09/02/12/vinyl-record-4043560_960_720.png");
`;

export const BoardItemLike = styled.div`
  font-size: 1.2rem;
  height: 2rem;
`;
export const BoardItemViews = styled.div`
  font-size: 1.2rem;
  height: 2rem;
`;

export const BoardItemArtist = styled.div`
  font-size: 1.2rem;
  height: 2rem;
`;
