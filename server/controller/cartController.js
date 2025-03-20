import { asyncHandler } from "../middlewares/asyncHandler.js"
import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js";

export const addCartItem = asyncHandler(
    async (req, res) => {

        const userId = req.user._id
        const {productId, variants} = req.body

        console.log("req.body", req.body)

        let cart = await Cart.findOne({user : userId})

        if(!cart){
            cart = await Cart.create({
                user : userId,
                items : [],
            })
        }

        //we will only be upadating one product at a time. But cart may have multiple products
        let cartItem = cart.items.find(item => {
            return item.product.toString() === productId
        })

        if(cartItem){
            //destructure objects withn the arguments itslef
            variants.forEach((variantItem)=>{
                const existingVariant = cartItem.variants.find(v => v.variantId === variantItem.variant)
                if (existingVariant) {
                    // Update quantity and prices
                    existingVariant.quantity = variantItem.qty
                } else {
                    // Add new variant
                    cartItem.variants.push({
                        variantId: variantItem.variant,
                        attributes: variantItem.variantDescription,
                        quantity: variantItem.qty,
                    })
                }
            })
        } else {
            const newCartItem = {
                product: productId,
                variants: variants.map((variantItem) => ({
                    variantId: variantItem.variant,
                    attributes: variantItem.variantDescription,
                    quantity: variantItem.qty,
                })),
            }
            cart.items.push(newCartItem)
        }

        await cart.save()

        res.status(200).json({
            success: true,
            message : "Product added to cart successfully",
            cart
        })
    }
)

export const getCartItems = asyncHandler(
    async (req, res) => {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'productName images variants bulkDiscount basePrice'
            });


        if (!cart) {
            res.status(404)
            throw new Error("Cart not found")
        }

        const processedItems = cart.items.map(item => {
            const product = item.product;
            
            const processedVariants = item.variants.map(variant => {
                const productVariant = product.variants.find(
                    pv => pv.variantId === variant.variantId
                );

                const basePrice = productVariant ? productVariant.basePrice : product.basePrice;
                const quantity = variant.quantity;
                const variantTotal = basePrice * quantity;

                return {
                    variantId: variant.variantId,
                    attributes: variant.attributes,
                    quantity: quantity,
                    basePrice,
                    variantTotal,
                    stock: productVariant ? productVariant.stock : product.stock,
                    inStock: productVariant ? productVariant.inStock : product.inStock
                };
            });

            // Calculate total quantity and amount for this product
            const productTotalQuantity = processedVariants.reduce((sum, variant) => sum + variant.quantity, 0);
            const productSubtotal = processedVariants.reduce((sum, variant) => sum + variant.variantTotal, 0);
            
            // Calculate bulk discount if applicable
            let productDiscount = 0;
            if (product.bulkDiscount) {
                const applicableDiscount = product.bulkDiscount.find(
                    discount => productTotalQuantity >= discount.minQuantity
                );
                if (applicableDiscount) {
                    productDiscount = (productSubtotal * applicableDiscount.discountPercentage) / 100;
                }
            }

            return {
                productId: product._id,
                productName: product.productName,
                image: product.images[0],
                variants: processedVariants,
                bulkDiscount: product.bulkDiscount,
                productSubtotal,
                productDiscount,
                productTotal: productSubtotal - productDiscount,
                totalQuantity: productTotalQuantity
            };
        });

        // Calculate cart totals
        const totalQuantity = processedItems.reduce((sum, item) => sum + item.totalQuantity, 0);
        const subtotalBeforeDiscount = processedItems.reduce((sum, item) => sum + item.productSubtotal, 0);
        const totalDiscount = processedItems.reduce((sum, item) => sum + item.productDiscount, 0);
        const shippingCharge = totalQuantity < 50 ? 500 : 0;
        const platformFee = 30;

        const cartTotal = subtotalBeforeDiscount - totalDiscount + shippingCharge + platformFee;

        res.status(200).json({
            success: true,
            cart: {
                items: processedItems,
                summary: {
                    subtotalBeforeDiscount,
                    totalDiscount,
                    subtotalAfterDiscount: subtotalBeforeDiscount - totalDiscount,
                    shippingCharge,
                    platformFee,
                    cartTotal
                }
            }
        });
    }
);

export const updateCart = asyncHandler(
    async (req, res) => {
        const userId = req.user._id;
        const { variants } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404);
            throw new Error("Cart not found");
        }

        for (const item of cart.items) {
            // Find variants in the update request for this product
            const updatedVariants = variants.filter(v => v.productId.toString() === item.product.toString());
            
            if (updatedVariants.length === 0) {
                // If no variants found for this product, remove the entire product from cart
                cart.items = cart.items.filter(cartItem => 
                    cartItem.product.toString() !== item.product.toString()
                );
                continue;
            }

            // Update existing variants and remove those not in the update request
            item.variants = item.variants.filter(existingVariant => {
                const updatedVariant = updatedVariants.find(
                    v => v.variantId === existingVariant.variantId
                );
                
                if (updatedVariant) {
                    // Update quantity if variant still exists
                    existingVariant.quantity = updatedVariant.quantity;
                    return true;
                }
                return false; // Remove variant if not in update request
            });

            // Add any new variants
            updatedVariants.forEach(newVariant => {
                const exists = item.variants.some(v => v.variantId === newVariant.variantId);
                if (!exists) {
                    item.variants.push({
                        variantId: newVariant.variantId,
                        attributes: newVariant.attributes,
                        quantity: newVariant.quantity
                    });
                }
            });
        }

        // Remove products with no variants
        cart.items = cart.items.filter(item => item.variants.length > 0);

        // Save the updated cart
        await cart.save();

        // Fetch the updated cart with populated product details
        const updatedCart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'productName images variants bulkDiscount basePrice'
            });

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart: updatedCart
        });
    }
);

//for processing data for the buyNow feature
export const processCartItems = asyncHandler(
    async (req, res) => {
        const userId = req.user._id;
        const { productId, variants } = req.body;

        if (!productId || !variants) {
            res.status(400);
            throw new Error("Product ID and variants are required");
        }

        // Fetch product details first to validate
        const product = await Product.findById(productId)
            .select('productName images variants bulkDiscount basePrice');

        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        // Create a temporary cart structure
        let tempCart = {
            user: userId,
            items: [{
                product: product,
                variants: variants.map((variantItem) => ({
                    variantId: variantItem.variant,
                    attributes: variantItem.variantDescription,
                    quantity: variantItem.qty,
                })),
            }]
        };

        // Process items in the same way as getCartItems
        const processedItems = tempCart.items.map(item => {
            const product = item.product;
            
            const processedVariants = item.variants.map(variant => {
                const productVariant = product.variants.find(
                    pv => pv.variantId === variant.variantId
                );

                const basePrice = productVariant ? productVariant.basePrice : product.basePrice;
                const quantity = variant.quantity;
                const variantTotal = basePrice * quantity;

                return {
                    variantId: variant.variantId,
                    attributes: variant.attributes,
                    quantity: quantity,
                    basePrice,
                    variantTotal,
                    stock: productVariant ? productVariant.stock : product.stock,
                    inStock: productVariant ? productVariant.inStock : product.inStock
                };
            });

            const productTotalQuantity = processedVariants.reduce((sum, variant) => 
                sum + variant.quantity, 0
            );
            const productSubtotal = processedVariants.reduce((sum, variant) => 
                sum + variant.variantTotal, 0
            );
            
            let productDiscount = 0;
            if (product.bulkDiscount) {
                const applicableDiscount = product.bulkDiscount.find(
                    discount => productTotalQuantity >= discount.minQuantity
                );
                if (applicableDiscount) {
                    productDiscount = (productSubtotal * applicableDiscount.discountPercentage) / 100;
                }
            }

            return {
                productId: product._id,
                productName: product.productName,
                image: product.images[0],
                variants: processedVariants,
                bulkDiscount: product.bulkDiscount,
                productSubtotal,
                productDiscount,
                productTotal: productSubtotal - productDiscount,
                totalQuantity: productTotalQuantity
            };
        });

        // Calculate cart totals
        const totalQuantity = processedItems.reduce((sum, item) => 
            sum + item.totalQuantity, 0
        );
        const subtotalBeforeDiscount = processedItems.reduce((sum, item) => 
            sum + item.productSubtotal, 0
        );
        const totalDiscount = processedItems.reduce((sum, item) => 
            sum + item.productDiscount, 0
        );
        const shippingCharge = totalQuantity < 50 ? 500 : 0;
        const platformFee = 30;

        const cartTotal = subtotalBeforeDiscount - totalDiscount + shippingCharge + platformFee;

        res.status(200).json({
            success: true,
            cart: {
                items: processedItems,
                summary: {
                    subtotalBeforeDiscount,
                    totalDiscount,
                    subtotalAfterDiscount: subtotalBeforeDiscount - totalDiscount,
                    shippingCharge,
                    platformFee,
                    cartTotal
                }
            }
        });
    }
);
