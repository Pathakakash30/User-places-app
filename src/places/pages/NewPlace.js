import React, { useCallback, useReducer } from "react";

import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import "./PlaceForm.css";

const NewPlace = () => {
  const [formState, inputHandler] = useForm(
    {
      title: {
        title: {
          value: " ",
          isValid: false,
        },
        description: {
          value: " ",
          isValid: false,
        },
        address: {
          value: " ",
          isValid: false,
        },
      },
    },
    false
  );

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter valid title."
        onInput={inputHandler}
      />

      <Input
        id="description"
        element="textarea"
        type="text"
        label="description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter valid title description. (atleast 5 characters)."
        onInput={inputHandler}
      />

      <Input
        id="address"
        element="input"
        type="text"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter valid address."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlace;
