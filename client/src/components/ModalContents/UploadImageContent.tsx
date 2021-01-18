import * as React from "react";
import { useState, useRef, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import placeholderImage from "#root/assets/placeholder-image.png";

import { ModalContext } from "#root/context/modalContext";
import {
  ImagesDocument,
  useUploadImageMutation,
} from "#root/generated/graphql";
import { Button } from "#root/components/GlobalStyledComponents";

interface UploadImageContentProps {}

interface FormData {
  description: string;
  picture: [File];
}

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 500px;
  font-size: 1.3rem;
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
`;

const TextArea = styled.textarea`
  border: none;
  font-size: 1.1rem;
  font-family: "Roboto", sans-serif;
  resize: none;
  outline: none;
  @media (max-width: 768px) {
    height: 7rem;
  }
`;

const StyledImage = styled.img`
  border-radius: 1rem;
  margin: 1rem 0 1rem 0;
  transition: 0.5s;
  height: auto;
  max-width: 100%;
  vertical-align: middle;
  :hover {
    opacity: 0.5;
  }
`;

const ErrorMessageText = styled.p`
  margin: 0 1rem 1rem 1rem;
  font-size: 1rem;
  color: #cc0000;
`;

const UploadImageContent: React.FC<UploadImageContentProps> = ({}) => {
  const [uploadImageMutation] = useUploadImageMutation();

  let { handleModal } = useContext(ModalContext);
  const [image, setImage] = useState<File | null>();
  const [preview, setPreview] = useState<string | null>();

  const imgRef = useRef<HTMLInputElement | null>();

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file && file.type.substr(0, 5) == "image") {
      setImage(file);
    } else {
      setImage(null);
    }
  };

  const handleImageClick = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    event.preventDefault();
    imgRef.current?.click();
  };

  const onSubmit = async ({ description, picture }: FormData) => {
    if (!picture[0]) {
      console.log("nincs file");
      return;
    }
    try {
      const { data } = await uploadImageMutation({
        variables: { description, file: picture[0] },
        refetchQueries: [{ query: ImagesDocument }],
      });
      console.log(data?.uploadImage.url);
    } catch (error) {
      console.log("valami rossz");
      console.log(error);
    }
    reset();
    handleModal();
  };

  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
    errors,
    reset,
  } = useForm<FormData>();

  return (
    <Wrapper onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        placeholder="Write something..."
        ref={register}
        name="description"
        disabled={isSubmitting}
      ></TextArea>
      <input
        disabled={isSubmitting}
        ref={(e) => {
          register(e, {
            required: true,
          });
          imgRef.current = e;
        }}
        onChange={handleInputChange}
        style={{ display: "none" }}
        type="file"
        name="picture"
        accept="image/*"
      />
      <StyledImage
        onClick={handleImageClick}
        src={preview ? preview : placeholderImage}
      />
      {errors.picture && (
        <ErrorMessageText>you have not selected an image</ErrorMessageText>
      )}
      <Button type="submit" disabled={isSubmitting}>
        Upload
      </Button>
    </Wrapper>
  );
};
export default UploadImageContent;
