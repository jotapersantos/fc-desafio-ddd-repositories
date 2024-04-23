import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    try {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer");
      const address = new Address("Main Street", 1, "99999999", "City");
      customer.changeAddress(address);
      await customerRepository.create(customer);
  
      const productRepository = new ProductRepository();
      const product = new Product("123", "Product", 10);
      await productRepository.create(product);
  
      const orderRepository = new OrderRepository();
      const item = new OrderItem("1", product.name, product.price, product.id, 1);
      let order = new Order("123", customer.id, [item]);
      await orderRepository.create(order);
    
      let orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });
  
      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: order.total(),
        items: [{
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          order_id: "123",
          product_id: "123"
        }]
      });
      
      const product2 = new Product("456", "Product 2", 10);
      await productRepository.create(product2);

      const item2 = new OrderItem(
        "2",
        product2.name,
        product2.price,
        product2.id,
        1
      );

      order = new Order("123", "123", [item,item2]);

      await orderRepository.update(order);

      orderModel = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });
      
      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: order.total(),
        items: [
          {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            order_id: "123",
            product_id: "123",
          },
          {
            id: item2.id,
            name: item2.name,
            price: item2.price,
            quantity: item2.quantity,
            order_id: "123",
            product_id: "456",
          }
        ],
      });

    }
    catch(error){
      console.log(error);
    }
  });

  it("should find an order", async () => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer");
      const address = new Address("Main Street", 1, "99999999", "City");
      customer.changeAddress(address);
      await customerRepository.create(customer);
  
      const productRepository = new ProductRepository();
      const product = new Product("123", "Product", 10);
      await productRepository.create(product);
  
      const orderRepository = new OrderRepository();
      const item = new OrderItem("1", product.name, product.price, product.id, 1);
      let order = new Order("123", customer.id, [item]);
      await orderRepository.create(order);
    
      let orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] });
  
      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: order.total(),
        items: [{
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          order_id: "123",
          product_id: "123"
        }]
      });
  });

  it("should find all orders", async () => {
    try {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer");
      const address = new Address("Main Street", 1, "99999999", "City");
      customer.changeAddress(address);
      await customerRepository.create(customer);
    
      const productRepository = new ProductRepository();
      const product = new Product("123", "Product", 10);
      await productRepository.create(product);
    
      const orderRepository = new OrderRepository();
      const item = new OrderItem("1", product.name, product.price, product.id, 1);
      let order = new Order("123", customer.id, [item]);
      await orderRepository.create(order);
  
      const foundOrders = await orderRepository.findAll();
      const orders = [order];
  
      expect(orders).toEqual(foundOrders);    
    }catch(error){
      console.log(error);
    }
  });

});
