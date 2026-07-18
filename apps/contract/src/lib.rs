#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, token, Address, Env, Symbol};

const FUNDED: Symbol = symbol_short!("Funded");
const DISBURSED: Symbol = symbol_short!("Disbursed");

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Token,
}

#[contract]
pub struct AidEscrowContract;

#[contractimpl]
impl AidEscrowContract {
    pub fn initialize(env: Env, admin: Address, token: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
    }

    pub fn fund(env: Env, donor: Address, amount: i128) {
        donor.require_auth();

        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let contract_address = env.current_contract_address();

        token::Client::new(&env, &token).transfer(&donor, &contract_address, &amount);

        env.events().publish((FUNDED, donor), amount);
    }

    pub fn disburse(env: Env, recipient: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let contract_address = env.current_contract_address();

        token::Client::new(&env, &token).transfer(&contract_address, &recipient, &amount);

        env.events().publish((DISBURSED, recipient), amount);
    }
}
