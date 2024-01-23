# eq-string

Input component which have multiple actions, like: clear, reset, cancel and save the value as null or empty string.

<br>
<p align="center" width="100%">
<img align="center" src="./doc/eq-string.gif" alt="eq-string preview">
</p>

## Usage

```angular17html

<eq-string
  [value]="'My value'"
  [title]="'My title'"
  [placeholder]="'My placeholder'"
  [hint]="'My hint'"
  [nullable]="true"
  [disabled]="false"
  [required]="true"
  [mode]="'edit'"
  [size]="'small'"
  [error]="'My error'"
></eq-string>
```

## Properties

| Property    | Required |                           Type                            | Default      | Description                                                                                                                                                                           |
|-------------|:--------:|:---------------------------------------------------------:|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| value       | Required |                 ``'string'`` \| ``null``                  |              | Value to handle                                                                                                                                                                       |
| nullable    | Optional |                        ``boolean``                        | ``false``    | Can have a value to ``[null]``                                                                                                                                                        |
| placeholder | Optional |                        ``string``                         | ``''``       | The placeholder attribute of the input                                                                                                                                                |
| disabled    | Optional |                        ``boolean``                        | ``false``    | Disable the field                                                                                                                                                                     |
| required    | Optional |                        ``boolean``                        | ``false``    | **EN ATTENDE D'APPROBATION PAR CEDRIC**                                                                                                                                               |
| mode        | Optional |                 ``'view'`` \| ``'edit'``                  | ``'view'``   | Used for the context, is the input can be editable or it's purpose is only used for looking the value.<br><br>The view mode show only the value of the input without label, hint, ... |
| title       | Required |                        ``string``                         |              | Used for the input label                                                                                                                                                              |
| hint        | Optional |                        ``string``                         | ``''``       | Used for a describe the value attempted by the input value                                                                                                                            |
| size        | Optional | ``'small'`` \| ``'normal'`` \| ``'large'`` \| ``'extra'`` | ``'normal'`` | For styling purpose, the component's sizing                                                                                                                                           |
| error       | Required |                       ``'string'``                        |              | Error message when the input value is wrong  <br><br>The error message can be trigger only if the required property is set to ``'true'``                                              |

