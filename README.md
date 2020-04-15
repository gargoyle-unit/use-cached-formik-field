# useCachedFormikField React Hook
Wrapper for Formik useField enabling caching of field value and error message. This enables validation of a field only being executed when the field value has changed and
prevents async validation from being performed on every event within the form.

Installation:

  ```sh
  npm i use-cached-formik-field
  ```

### Usage

```javascript
import * as React from 'react';
import { useCachedFormikField } from 'use-cached-formik-field';
import { validateData } from 'api'

const InputComponent = (props) => {
    const [fieldProps, metaProps, helperProps] = useCachedFormikField(
        {
            name: 'name',
            validation: async () => {
                const result = await validateData();
                if (result.error) {
                    return 'Error...';
                } 
            }
        }, 
        'Name',
        350,
    );
    
    return (<input {...fieldProps />);
};

export default Component;
```

### Reference:

```javascript
 const [fieldProps, metaProps, helperProps] = useCachedFormikField(fieldInputProps, initialValue, debounceTimeout);
```

See https://jaredpalmer.com/formik/docs/api/useField for the returned props and the fieldInputProps. The validate property is now required instead of optional. 
InitialValue can be retreived from the formik values property. DebounceTimeout is optional and a debounce will not be performed if omitted.






