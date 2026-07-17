#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, Symbol,
};

#[contract]
pub struct AidEscrowContract;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Token,
}

#[contractimpl]
impl AidEscrowContract {
    /// Initialize the contract with the administrator address and the tracking token (USDC).
    pub fn initialize(env: Env, admin: Address, token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
    }

    /// Fund the escrow contract by transferring tokens from the donor to the contract.
    pub fn fund(env: Env, donor: Address, amount: i128) {
        donor.require_auth();

        let token_address: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_address);

        let contract_address = env.current_contract_address();

        // Transfer tokens from donor to this contract
        token_client.transfer(&donor, &contract_address, &amount);

        // Emit a custom event
        let topics = (symbol_short!("Funded"), donor.clone());
        env.events().publish(topics, amount);
    }

    /// Disburse funds from the escrow contract to the recipient.
    pub fn disburse(env: Env, recipient: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let token_address: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_address);

        let contract_address = env.current_contract_address();

        // Transfer tokens from this contract to recipient
        token_client.transfer(&contract_address, &recipient, &amount);

        // Emit a custom event
        let topics = (symbol_short!("Disbursed"), recipient.clone());
        env.events().publish(topics, amount);
    }
}
