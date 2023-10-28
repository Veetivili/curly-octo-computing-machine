### Dependencies:

- Cors
- Bcryptjs
- Jsonwebtoken
- Dotenv
- Express
- MongoDB
- Mongoose
- Supertest
- Jest
- Cross-Env
- Mongoose

### Scripts:

Run automated unit tests:

```sh
npm run test
```

Start application:

```sh
npm start
```

## Functionality

#### Authentication

**POST `http://localhost:3000/api/auth/login`**  
- Payload:

    ```json
    {
    "username": "testuser",
    "password": "password"
    }
    ```
- Response: `Status:{200}`
    ```json
    "data": {
            "username": "testuser",
            "token": "eyJhbGciKiJIUzI1NiIsInR1cCI6IkpXVCJ9.eyJpZCI6IjY1MzhkN2U2ZjI2ODEzZmQzMWU2MDgxMiIsImlhdCI6MTY5ODQxNzU4MSwiZXhwIjoxNjk2NDIxMTgxfQ.w8xGjGZexiT3QBLtlmsW0Gp_pIzceqqfxpQ-MxuQFy4"
        }
    ```

Succesful login returns an access-token, which is required in every route after `/api/auth/login` login. Token is created during the login process.

```js
* Generates a JSON Web Token (JWT) for the authenticated user.
* @param {Object} user - The user object to generate the token for.
* @param {string} process.env.SECRET_KEY - The secret key used to sign the token.
* @param {Object} options - Additional options for the token.
* @param {number} options.expiresIn - The expiration time of the token in seconds.
* @returns {string} The generated JWT.

const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: 3600 // 24 hours
    });
```

Token is validated in each request to routes requiring authentication.

```js
/**
 * Middleware function to authenticate JSON Web Tokens (JWT).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - Express response object.
 */

function authenticateJWT(req, res, next) {
    const token = req.headers['authorization-token'];

    if(!token) {
        return res.status(401).json({
            message: 'Unauthorized, please login.'
        });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        
        if(err) {
            return res.status(403).json({
                message: 'Authorization failed, please login again.'
            });
        }

        req.user = user;
        next();
    })
};
```

#### `/Login` status codes:

 - **Successful login: `Code: 200`**
 - **Invalid username & Password: `Code: 401`**

#### **`/logout`** ends the user session, it requires the `authorization-token` and inserts the token in `blacklist`. Token is not a valid after blacklisting.

#### `/Logout` status codes:

 - **Successful logout: `Code: 200`**
 - **Error: `Code: 401`**

```js
/**
 * Middleware function to check if a token is blacklisted.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - Returns a response object with a message if the token is blacklisted or calls the next middleware function.
 */
```

#### `api/products`

Returns JSON API format:

```json
{
            "id": "6538d098f26813fd31e607ab",
            "type": "product",
            "attributes": {
                "name": "Soup - Knorr, Classic Can. Chili",
                "description": "Proin eu mi. Nulla ac enim.",
                "price": "75.45"
            }
        },
```











