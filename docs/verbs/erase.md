# erase

Clears cell values that match a specific value. The opposite of [impute](./impute.md)

## Example

| id  | name  |
| --- | ----- |
| 1   | Bob   |
| 2   | Joe   |
| 3   | Jenny |

`erase columns['name'] with value='Jenny'`:

| id  | name |
| --- | ---- |
| 1   | Bob  |
| 2   | Joe  |
| 3   |      |
