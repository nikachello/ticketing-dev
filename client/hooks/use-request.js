import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess, setLoading }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess();
      }
      return response.data;
    } catch (err) {
      if (setLoading) {
        setLoading();
      }

      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {err.response.data.errors?.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
