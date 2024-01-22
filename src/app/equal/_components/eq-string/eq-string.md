# eq-string

Input component which have multiple actions, like: clear, reset, and save the value as null or empty string.

<br>
<img src="./doc/eq-string.gif" alt="eq-string preview">

## Usage

```angular2html

<eq-string
  [value]="'My value'"
  [nullable]="true"
  [placeholder]="'My placeholder'"
  [disabled]="false"
  [required]="true"
  [mode]="'edit'"
  [title]="'My title'"
  [hint]="'My hint'"
  [size]="'small'"
  [error]="'My error'"
></eq-string>
```

## Properties

| Property    | Required |                           Type                            | Default      | Description                                                                                                                                                                           |
|-------------|:--------:|:---------------------------------------------------------:|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| value       | Required |                 ``'string'`` \| ``null``                  |              | Value to handle                                                                                                                                                                       |
| nullable    | Optional |                        ``boolean``                        | ``false``    | If the field can have a value to ``null``                                                                                                                                             |
| placeholder | Optional |                        ``string``                         | ``''``       | The placeholder attribut of the input                                                                                                                                                 |
| disabled    | Optional |                        ``boolean``                        | ``false``    | Disable the field                                                                                                                                                                     |
| required    | Optional |                        ``boolean``                        | ``false``    | **EN ATTENDE D'APPROBATION PAR CEDRIC**                                                                                                                                               |
| mode        | Optional |                 ``'view'`` \| ``'edit'``                  | ``'view'``   | Used for the context, is the input can be editable or it's purpose is only used for looking the value.<br><br>The view mode show only the value of the input without label, hint, ... |
| title       | Required |                        ``string``                         |              | Used for the input label                                                                                                                                                              |
| hint        | Optional |                        ``string``                         | ``''``       | Used for a describe the value attempted by the input value                                                                                                                            |
| size        | Optional | ``'small'`` \| ``'normal'`` \| ``'large'`` \| ``'extra'`` | ``'normal'`` | For styling purpose, the size of the component                                                                                                                                        |
| error       | Required |                          string                           |              | Error message when the input value is wrong                                                                                                                                           |

