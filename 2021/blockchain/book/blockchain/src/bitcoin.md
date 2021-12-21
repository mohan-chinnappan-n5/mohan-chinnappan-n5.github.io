# Bitcoin

- Digital Signatures
- Proof of work
- Hash functions



## Ledger - Trust

- Ledger - Trust + Cryptography ==> CryptoCurrency

**Bitcoin** is one type of CryptoCurrency 

Other CryptoCurrency examples:
- Ethereum
- Ripple
- Litecoin
- Ethereum Classic
...


### Sample Ledger
From|Action|To|Amount|
---|---|---|---|
Alice|pays|Bob|$20|
Bob|pays|Charlie|$40|
Alice|pays|Mohan|$50|


## Bitcoin protocol

- Banks does not verify the transaction
- Based on De-centralized trustless verification based on math born in Cryptography
    - Digital Signatures
    - Hash functions 


## Ledger functions
- Anyone can add line to the ledger (how to verify fraud - adding lines...)
- Settle up every month with real money


-  Sample Ledger with Digital Signature


UID|From|Action|To|Amount|DigitalSignature|
---|---|---|---|---|---|
0|Alice|pays|Bob|$20|*Alice*|
1|Bob|pays|Charlie|$40|*Bob*|
2|Alice|pays|Mohan|$50|*Alice*|

UID - Unique ID prevents anyone to cut and paste forgery and UID is also an input the the signature function.

### Keys
- How do to prevent forgery for the digital Signature?
    - Every one has 
        - Public key  (pk)
        - Private Key (Secret Key) (sk)
            - user keeps the sk with herself
- Altering the document content (even slightly) will change the digital signature

### Signature and Verification  

\\(Signature = Sign(message, sk)\\)
- It is 256 bit
- \\( 2^{256}\\) possible signatures
- Private Key ensures that only the owner of the Private Key can creates that signature

- So, no can copy that message and put a signature on it!

- Verification that signature is valid

\\(Verified = Verify(message, Signature, pk)\\) 
- outputs **true** or **false** to assert that this is the signature created by the Private Key associated with this Public Key
- verification of the transaction involves knowing the full history of the transaction so **no one can do overdraw**

\\( \int x dx = \frac{x^2}{2} + C \\)

### Currency == Transaction History

- Ledger is distributed 
    - Everyone has a copy of it
- If a new line is to be added in the L edger, that info is broadcasted and that line is added to all the copies of the Ledger


## Proof work

Blocks are chained like this:
![blockchain](img/blockchain.svg)


- Miners (anyone in the world can be a miner) get the broadcasted blocks
- Pick the blocks and do the work
    - of finding the special number which make the **hash** of the block to contain **certain number of zeros** (say 60 of them, which will be frequently changed, as more miners are added, so on average it takes 10 minute find a block, so one winner every 10 minute)
- Once miner has found that the special number
    - broadcast the block the miner found
    - miner gets the reward the work
        - once the miner works out that special the system allows the miner to put a special transaction at the top in the block (say 10 Ledger Dollar out of thin-air!), which provides reward for the work.
        - this is called **block reward**.
        - this adds money to the money supply

## Conflict resolution
- If we have distinct 2 block chains with conflicting  transaction history
    - Defer to the longest one - one with more work put into it


## Limits
Each block may contain max 2,400 transactions.

## References
- [Block Explorer](https://blockexplorer.com/)
### Videos

<iframe width="800" height="480" src="https://www.youtube.com/embed/bBC-nXj3Ng4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

