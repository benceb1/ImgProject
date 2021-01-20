import * as React from "react";
import { useContext } from "react";
import { AiFillDelete, AiOutlineUpload } from "react-icons/ai";
import styled from "styled-components";

import { ModalContext } from "#root/context/modalContext";
import UploadImageContent from "#root/components/ModalContents/UploadImageContent";
import {
  ImagesDocument,
  useDeleteImageMutation,
  useImagesQuery,
} from "#root/generated/graphql";
import { Button } from "#root/components/GlobalStyledComponents";

interface ImagesProps {}

const Wrapper = styled.div`
  margin: 0 auto;
  width: 1000px;
  min-height: calc(100vh - 9.688rem);

  @media (max-width: 1300px) {
    width: 700px;
  }

  @media (max-width: 1300px) {
    width: 90%;
  }
`;

const TopButtons = styled.div`
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.fontColor};
`;

const ImageCard = styled.div`
  width: 150px;
  margin: 0 1.5rem 1.5rem 0;
  display: inline-block;
  width: 100%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  padding: 5px;
  border-radius: 0.5rem;
  transition: all 0.25s ease-in-out;
`;

const Cards = styled.div`
  columns: 2 400px;
  column-gap: 1rem;
  width: 100%;
  margin: 1rem auto;
`;

const ImageContainer = styled.img`
  width: 100%;
  border-radius: 5px;
  transition: all 0.25s ease-in-out;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 1rem;

  p {
    margin: 5px 0;
    padding: 0;
    text-align: center;
  }
`;

const DeleteButton = styled.button`
  width: 40px;
  height: 40px;
  border: 0;
  outline: 0;
  cursor: pointer;
  margin-left: 2rem;
  margin-right: 1rem;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  color: #b1b1b1;
  background-color: transparent;
  transition: 0.2s all;
  :hover {
    color: #cc0000;
  }
`;

const Images: React.FC<ImagesProps> = ({}) => {
  const { handleModal } = useContext(ModalContext);

  const { data, loading, error } = useImagesQuery();

  const [deleteImageMutation] = useDeleteImageMutation();

  const handleDelete = async (imageId: string) => {
    if (window.confirm("Are you sure you wish to delete this item?")) {
      const { data } = await deleteImageMutation({
        variables: { imageId },
        refetchQueries: [{ query: ImagesDocument }],
      });
      if (data?.deleteImage) {
        console.log("success");
      } else {
        console.log("somethin went wrong");
      }
    }
  };

  let body = null;

  if (loading) {
    body = null;
  } else if (data && data.images) {
    body = data.images.map((image, i) => (
      <ImageCard key={i}>
        <ImageContainer src={image.url} />
        <DetailsContainer>
          <p>{image.description}</p>
          <DeleteButton onClick={() => handleDelete(image.id)}>
            <AiFillDelete style={{ margin: "auto" }} />
          </DeleteButton>
        </DetailsContainer>
      </ImageCard>
    ));
  } else {
    body = <div>not logged in</div>;
  }

  return (
    <div>
      <Wrapper>
        <TopButtons>
          <Button
            onClick={() => handleModal(<UploadImageContent />, "Kép feltöltés")}
          >
            <AiOutlineUpload /> Upload
          </Button>
        </TopButtons>
        <Cards>{body}</Cards>
      </Wrapper>
    </div>
  );
};
export default Images;
