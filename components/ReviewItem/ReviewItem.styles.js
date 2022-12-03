import styled from "styled-components";

export const ReviewItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background-color: #fff;
  color: #000;
  border: 1px solid lightgray;
  padding: 0.75rem;
  background-color: #f5f5f5;
`;

export const Text = styled.p`
  font-weight: 500;
  color: #000;
`;

export const StarRating = styled.div`
  display: inline-block;
  filter: drop-shadow(0 0 0.5rem #f9d71c);
`;
