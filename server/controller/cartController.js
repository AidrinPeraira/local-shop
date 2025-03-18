import { asyncHandler } from "../middlewares/asyncHandler.js"
import Cart from "../models/cartModel.js"

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

                const bulkDiscount = product.bulkDiscount
                    .filter(discount => discount.minQty <= variant.quantity)
                    .sort((a, b) => b.minQty - a.minQty)[0] || { priceDiscountPerUnit: 0 };

                const basePrice = productVariant ? productVariant.basePrice : product.basePrice;
                const unitPrice = basePrice - bulkDiscount.priceDiscountPerUnit;
                const subtotal = unitPrice * variant.quantity;

                return {
                    variantId: variant.variantId,
                    attributes: variant.attributes,
                    quantity: variant.quantity,
                    basePrice,
                    unitPrice,
                    discountPerUnit: bulkDiscount.priceDiscountPerUnit,
                    bulkDiscount: product.bulkDiscount,
                    subtotal,
                    stock: productVariant ? productVariant.stock : product.stock,
                    inStock: productVariant ? productVariant.inStock : product.inStock
                };
            });

            const itemTotal = processedVariants.reduce((sum, variant) => sum + variant.subtotal, 0);

            return {
                productId: product._id,
                productName: product.productName,
                image: product.images[0], 
                variants: processedVariants,
                itemTotal
            };
        });

        const cartTotal = processedItems.reduce((sum, item) => sum + item.itemTotal, 0);

        res.status(200).json({
            success: true,
            cart: {
                items: processedItems,
                cartTotal
            }
        });
    }
);