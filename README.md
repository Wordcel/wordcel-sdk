# wordcel-ts

Typescript monorepo for interacting with on chain programs in the wordcel ecosystem


Wordcel's architecture heavily relies on the existence of an indexer to query data efficiently out of the solana blockchain. Our friends at @conciselabs run our indexer and the sdk uses their graphql endpoint to serve up requests. Note that the public endpoint is rate limited.

You can checkout the Grapqhl API in the playground [here](https://cloud.hasura.io/public/graphiql?endpoint=https://public-wordcel.conciselabs.io/v1/graphql). 

<img width="1764" alt="Screenshot 2022-10-16 at 7 39 02 PM" src="https://user-images.githubusercontent.com/602823/196040018-3c54c7ce-e73c-419a-bd1d-d2291b32726f.png">
