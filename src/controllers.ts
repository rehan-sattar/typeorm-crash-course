import { Request, Response } from 'express';
import { Banker } from './entities/banker';
import { Client } from './entities/client';
import { Transactions, TransactionTypes } from './entities/transaction';

interface CreateClientDTO {
  firstName: string;
  lastName: string;
  email: string;
  cardNumber: string;
  balance: number;
}

export const createClient = async (req: Request, res: Response) => {
  const { firstName, lastName, email, cardNumber, balance } = req.body as CreateClientDTO;

  const client = Client.create({
    first_name: firstName,
    last_name: lastName,
    card_number: cardNumber,
    email,
    balance
  });

  await client.save();
  return res.status(201).send(client);
};

interface CreateBankerDTO {
  firstName: string;
  lastName: string;
  email: string;
  cardNumber: string;
  employeeNumber: string;
}

export const createBanker = async (req: Request, res: Response) => {
  const { firstName, lastName, email, cardNumber, employeeNumber } = req.body as CreateBankerDTO;

  const banker = Banker.create({
    first_name: firstName,
    last_name: lastName,
    email,
    card_number: cardNumber,
    employee_number: employeeNumber
  });

  await banker.save();

  return res.status(201).send(banker);
};

interface TransactionDTO {
  type: TransactionTypes;
  amount: number;
}

export const createTransaction = async (req: Request, res: Response) => {
  const clientId = req.params.clientId;
  const { type, amount } = req.body as TransactionDTO;
  const client = await Client.findOne({ where: { id: parseInt(clientId) } });
  if (!client) {
    return res.status(404).send({
      message: 'Client not found!'
    });
  }
  const transaction = Transactions.create({
    transaction_type: type,
    amount,
    client
  });
  await transaction.save();
  if (type === TransactionTypes.DEPOSIT) {
    client.balance = client.balance + amount;
  } else if (type === TransactionTypes.WITHDRAW) {
    client.balance = client.balance - amount;
  }
  await client.save();
  return res.status(201).send(transaction);
};

export const connectBankerAndClient = async (req: Request, res: Response) => {
  const { bankerId, clientId } = req.params;

  const client = await Client.findOne({ where: { id: parseInt(clientId) } });
  const banker = await Banker.findOne({ where: { id: parseInt(bankerId) } });

  if (!banker || !client) {
    return res.status(401).send({
      message: "Banker or Client doesn't exist."
    });
  }
  banker.clients = [client];
  await banker.save();
  return res.status(201).send({
    message: 'Banker and client connected.'
  });
};

export const deleteClient = async (req: Request, res: Response) => {
  const clientId = parseInt(req.params.clientId);
  await Client.delete(clientId);
  return res.send({ message: 'Client deleted.' });
};
