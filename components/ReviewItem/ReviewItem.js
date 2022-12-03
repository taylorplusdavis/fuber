import React from "react";
import { useEffect } from "react";
import * as S from "./ReviewItem.styles";

function ReviewItem({ review }) {
  return (
    <div key={review.id}>
      <S.ReviewItemContainer>
        <div>
          {new Array(parseInt(review.rating)).fill().map((_, i) => (
            <S.StarRating key={i}>⭐</S.StarRating>
          ))}
          <S.Text>{review.review}</S.Text>
        </div>
      </S.ReviewItemContainer>
    </div>
  );
}

export default ReviewItem;
