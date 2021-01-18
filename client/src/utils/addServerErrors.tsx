type FieldError<T> = (
  field: String,
  error: { type: string; message: string }
) => void;

export function addServerErrors<T>(
  errors: { field: keyof T; message: string }[],
  setError: FieldError<T>
) {
  return errors.forEach(({ field, message }) => {
    setError(field as any, {
      type: "server",
      message: message,
    });
  });
}
