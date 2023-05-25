import os
import requests
import json
import stripe
from django.http import JsonResponse
from api.constants.http_status import HTTP_STATUS
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from api.utils.request_method_wrappers import post_wrapper, put_wrapper, get_wrapper, delete_wrapper
from api.models import User

# TODO: FINISH PAYPAL PAYMENTS

# Paypal Docs:
# https://developer.paypal.com/api/rest/authentication/

# Set up PayPal API credentials
if os.getenv('STAGE') == 'production':
    client_id = os.getenv('PAYPAL_CLIENT_ID_PRODUCTION')
    endpoint = 'https://api.paypal.com'
    stripe.api_key = "YOUR_STRIPE_SECRET_KEY"
elif os.getenv('STAGE') == 'development':
    client_id = os.getenv('PAYPAL_CLIENT_ID_SANDBOX')
    endpoint = 'https://api.sandbox.paypal.com'
    stripe.api_key = "YOUR_STRIPE_SECRET_KEY"

client_secret = os.getenv('PAYPAL_SECRET')


@csrf_exempt
@post_wrapper
def stripe_create_payment_intent(request):
    req = json.loads(request.body)
    amount = req["amount"]
    currency = req["currency"]
    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency=currency,
    )
    return JsonResponse({
        "clientSecret": intent.client_secret
    })

# Get the bearer token


def paypal_get_access_token():
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        'grant_type': 'client_credentials',
    }
    try:
        # Send a request for the access token.
        response = requests.post(
            f'{endpoint}/v1/oauth2/token', headers=headers, auth=(client_id, client_secret), data=data)

        # example expected response:
        # {
        #    "scope": "https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/disputes/read-buyer https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller https://uri.paypal.com/services/payments/payment/authcapture openid https://uri.paypal.com/services/disputes/read-seller https://uri.paypal.com/services/payments/refund https://api-m.paypal.com/v1/vault/credit-card https://api-m.paypal.com/v1/payments/.* https://uri.paypal.com/payments/payouts https://api-m.paypal.com/v1/vault/credit-card/.* https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks",
        #    "access_token": "A21AAFEpH4PsADK7qSS7pSRsgzfENtu-Q1ysgEDVDESseMHBYXVJYE8ovjj68elIDy8nF26AwPhfXTIeWAZHSLIsQkSYz9ifg",
        #    "token_type": "Bearer",
        #    "app_id": "APP-80W284485P519543T",
        #    "expires_in": 31668,
        #    "nonce": "2020-04-03T15:35:36ZaYZlGvEkV4yVSz8g6bAKFoGSEzuy3CQcz3ljhibkOHg"
        # }

        if response.status_code != 200:
            raise ValueError('Failed to get access token')
    except ValueError as ve:
        print(ve)
        return {'success': False, 'message': str(ve)}
    except Exception as e:
        print(e)
        return {'success': False, 'message': str(e)}

    access_token = response.json()['access_token']

    return access_token


@csrf_exempt
@login_required
@post_wrapper
def paypal_create_ordder(request):
    user = request.user
    # Step 1: Create an order
    access_token = paypal_get_access_token()
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}',
    }

    payload = {
        "intent": "CAPTURE",
        "payer": {
            "name": {
                "given_name": given_name,
                "surname": last_name
            },
            "email_address": email,
            "application_context": {
                "shipping_preference": "NO_SHIPPING"
            },
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": cartData["currency"],
                        "value": cartData["price"],
                        "breakdown": {
                            "item_total": {
                                "currency_code": cartData["currency"],
                                "value": cartData["price"]
                            },
                            "tax_total": {
                                "currency_code": cartData["currency"],
                                "value": "0.00"
                            }
                        }
                    },
                    "description": 'Purchase of credits.',
                    "invoice_number": invoice_number,
                    "payment_options": {
                        "allowed_payment_method": 'INSTANT_FUNDING_SOURCE'
                    },
                    "item_category": 'DIGITAL_GOODS',
                    # Company name displayed on bank statements or credit card statements.
                    "soft_descriptor": 'JASMA',
                    "items": [
                        {
                            "name": 'Credit purchase',
                            "unit_amount": {
                                    "currency_code": cartData["currency"],
                                    "value": cartData["price"]
                            },
                            "quantity": '1',
                            "description": 'Purchase of credits.'
                        }
                    ],
                    "billing_address": {
                        "address_line_1": '',  # '123 Main St',
                        "address_line_2": '',  # 'Suite 100',
                        "admin_area_2": '',  # 'San Jose',
                        "admin_area_1": '',  # 'CA',
                        "postal_code": '',  # '95131',
                        "country_code": '',  # 'US'
                    }
                },
            ]
        },
    }

    response = requests.post(
        f'{endpoint}/v2/checkout/orders', headers=headers, json=payload)

    if response.status_code != 201:
        raise ValueError('Failed to create order')

    order_id = response.json()['id']

# Capture the order


@csrf_exempt
@login_required
@post_wrapper
def paypal_capture_order(request):
    headers = {

    }

    data = {
        "payer_id": payer_id,
    }

    response = requests.post(
        f'{endpoint}/v2/checkout/orders/{order_id}/capture', headers=headers, json=data)

    if response.status_code != 201:
        raise ValueError('Failed to capture order')


@login_required
@get_wrapper
def paypal_get_payment_details(request):
    # Step 3: Get the transaction details
    transaction_id = response.json(
    )['purchase_units'][0]['payments']['captures'][0]['id']

    response = requests.get(
        f'{endpoint}/v2/payments/captures/{transaction_id}', headers=headers)

    if response.status_code != 200:
        raise ValueError('Failed to get transaction details')

    transaction_details = response.json()


@login_required
@get_wrapper
def paypal_get_order_details(request):
    response = requests.get(
        f'{endpoint}/v2/checkout/orders/{order_id}', headers=headers)

    if response.status_code != 200:
        raise ValueError('Failed to get order details')

    order_details = response.json()

#    {
#  "purchase_units": [
#    {
#        "reference_id": "d9f80740-38f0-11e8-b467-0ed5f89f718b",
#        "description": "string",
#        "custom_id": "string",
#        "invoice_id": "string",
#        "soft_descriptor": "string",
#        "items": [
#        {
#            "name": "string",
#            "quantity": "string",
#            "description": "string",
#            "sku": "string",
#            "category": "DIGITAL_GOODS",
#            "unit_amount": {
#            "currency_code": "str",
#            "value": "string"
#            },
#            "tax": {
#                "currency_code": "str",
#                "value": "string"
#            }
#        }
#        ],
#        "amount": {
#            "currency_code": "USD",
#            "value": "100.00",
#            "breakdown": {
#            "item_total": {
#                "currency_code": "str",
#                "value": "string"
#            },
#            "shipping": {
#                "currency_code": "str",
#                "value": "string"
#            },
#            "handling": {
#                "currency_code": "str",
#                "value": "string"
#            },
#            "tax_total": {
#                "currency_code": "str",
#                "value": "string"
#            },
#            "insurance": {
#                "currency_code": "str",
#                "value": "string"
#            },
#            "shipping_discount": {
#                "currency_code": "str",
#                "value": "string"
#            },
#            "discount": {
#                "currency_code": "str",
#                "value": "string"
#            }
#            }
#        },
#        "payee": {
#            "email_address": "string",
#            "merchant_id": "stringstrings"
#        },
#        "payment_instruction": {
#            "platform_fees": [
#            {
#                "amount": {
#                "currency_code": "str",
#                "value": "string"
#                },
#                "payee": {
#                "email_address": "string",
#                "merchant_id": "stringstrings"
#                }
#            }
#        ],
#        "payee_pricing_tier_id": "string",
#        "payee_receivable_fx_rate_id": "string",
#        "disbursement_mode": "INSTANT"
#    },
#      "shipping": {
#        "type": "SHIPPING",
#        "name": {
#          "given_name": "string",
#          "surname": "string"
#        },
#        "address": {
#          "address_line_1": "string",
#          "address_line_2": "string",
#          "admin_area_2": "string",
#          "admin_area_1": "string",
#          "postal_code": "string",
#          "country_code": "st"
#        }
#      },
#      "supplementary_data": {
#        "card": {
#          "level_2": {
#            "invoice_id": "string",
#            "tax_total": {
#              "currency_code": "str",
#              "value": "string"
#            }
#          },
#          "level_3": {
#            "ships_from_postal_code": "string",
#            "line_items": [
#              {
#                "name": null,
#                "quantity": null,
#                "description": null,
#                "sku": null,
#                "category": null,
#                "unit_amount": null,
#                "tax": null,
#                "commodity_code": null,
#                "unit_of_measure": null,
#                "discount_amount": null,
#                "total_amount": null
#              }
#            ],
#            "shipping_amount": {
#              "currency_code": "str",
#              "value": "string"
#            },
#            "duty_amount": {
#              "currency_code": "str",
#              "value": "string"
#            },
#            "discount_amount": {
#              "currency_code": "str",
#              "value": "string"
#            },
#            "shipping_address": {
#              "address_line_1": "string",
#              "address_line_2": "string",
#              "admin_area_2": "string",
#              "admin_area_1": "string",
#              "postal_code": "string",
#              "country_code": "st"
#            }
#          }
#        }
#      }
#    }
#  ],
#  "intent": "CAPTURE",
#  "payer": {
#    "email_address": "string",
#    "name": {
#      "given_name": "string",
#      "surname": "string"
#    },
#    "phone": {
#      "phone_type": "FAX",
#      "phone_number": {
#        "national_number": "string"
#      }
#    },
#    "birth_date": "stringstri",
#    "tax_info": {
#      "tax_id": "string",
#      "tax_id_type": "BR_CPF"
#    },
#    "address": {
#      "address_line_1": "string",
#      "address_line_2": "string",
#      "admin_area_2": "string",
#      "admin_area_1": "string",
#      "postal_code": "string",
#      "country_code": "st"
#    }
#  },
#  "payment_source": {
#    "card": {
#      "name": "string",
#      "number": "stringstrings",
#      "security_code": "stri",
#      "expiry": "string",
#      "billing_address": {
#        "address_line_1": "string",
#        "address_line_2": "string",
#        "admin_area_2": "string",
#        "admin_area_1": "string",
#        "postal_code": "string",
#        "country_code": "st"
#      },
#      "attributes": {
#        "customer": {
#          "id": "string",
#          "email_address": "string",
#          "phone": {
#            "phone_type": "FAX",
#            "phone_number": {
#              "national_number": "string"
#            }
#          }
#        },
#        "vault": {
#          "store_in_vault": "ON_SUCCESS"
#        }
#      },
#      "stored_credential": {
#        "payment_initiator": "CUSTOMER",
#        "payment_type": "ONE_TIME",
#        "usage": "FIRST",
#        "previous_network_transaction_reference": {
#          "id": "stringstr",
#          "date": "stri",
#          "network": "VISA"
#        }
#      },
#      "vault_id": "string"
#    },
#    "token": {
#      "id": "string",
#      "type": "BILLING_AGREEMENT"
#    },
#    "paypal": {
#      "experience_context": {
#        "brand_name": "EXAMPLE INC",
#        "shipping_preference": "SET_PROVIDED_ADDRESS",
#        "landing_page": "LOGIN",
#        "user_action": "PAY_NOW",
#        "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
#        "locale": "en-US",
#        "return_url": "https://example.com/returnUrl",
#        "cancel_url": "https://example.com/cancelUrl",
#        "payment_method_selected": "PAYPAL"
#      },
#      "billing_agreement_id": "string",
#      "vault_id": "string",
#      "email_address": "string",
#      "name": {
#        "given_name": "string",
#        "surname": "string"
#      },
#      "phone": {
#        "phone_type": "FAX",
#        "phone_number": {
#          "national_number": "string"
#        }
#      },
#      "birth_date": "stringstri",
#      "tax_info": {
#        "tax_id": "string",
#        "tax_id_type": "BR_CPF"
#      },
#      "address": {
#        "address_line_1": "string",
#        "address_line_2": "string",
#        "admin_area_2": "string",
#        "admin_area_1": "string",
#        "postal_code": "string",
#        "country_code": "st"
#      },
#      "attributes": {
#        "customer": {
#          "id": "string"
#        },
#        "vault": {
#          "store_in_vault": "ON_SUCCESS",
#          "description": "string",
#          "usage_pattern": "string",
#          "usage_type": "string",
#          "customer_type": "CONSUMER",
#          "permit_multiple_payment_tokens": false
#        }
#      }
#    },
#    "bancontact": {
#      "name": "string",
#      "country_code": "string",
#      "experience_context": {
#        "brand_name": "string",
#        "shipping_preference": "GET_FROM_FILE",
#        "locale": "string",
#        "return_url": "string",
#        "cancel_url": "string"
#      }
#    },
#    "blik": {
#      "name": "string",
#      "country_code": "string",
#      "email": "string",
#      "experience_context": {
#        "brand_name": "string",
#        "shipping_preference": "GET_FROM_FILE",
#        "locale": "string",
#        "return_url": "string",
#        "cancel_url": "string"
#      }
#    },
#    "eps": {
#      "name": "string",
#      "country_code": "string",
#      "experience_context": {
#        "brand_name": "string",
#        "shipping_preference": "GET_FROM_FILE",
#        "locale": "string",
#        "return_url": "string",
#        "cancel_url": "string"
#      }
#    },
#    "giropay": {
#      "name": "string",
#      "country_code": "string",
#      "experience_context": {
#        "brand_name": "string",
#        "shipping_preference": "GET_FROM_FILE",
#        "locale": "string",
#        "return_url": "string",
#        "cancel_url": "string"
#      }
#    },
#    "ideal": {
#      "name": "string",
#      "country_code": "string",
#      "bic": "string",
#      "experience_context": {
#        "brand_name": "string",
#        "shipping_preference": "GET_FROM_FILE",
#        "locale": "string",
#        "return_url": "string",
#        "cancel_url": "string"
#      }
#    },
#    "mybank": {
#      "name": "string",
#      "country_code": "string",
#      "experience_context": {
#        "brand_name": "string",
#        "shipping_preference": "GET_FROM_FILE",
#        "locale": "string",
#        "return_url": "string",
#        "cancel_url": "string"
#      }
#    },
#    "p24": {
#      "name": "string",
#      "email": "string",
#      "country_code": "string",
#      "experience_context": {
#        "brand_name": "string",
#        "shipping_preference": "GET_FROM_FILE",
#        "locale": "string",
#        "return_url": "string",
#        "cancel_url": "string"
#      }
#    },
#    "sofort": {
#      "name": "string",
#      "country_code": "string",
#      "experience_context": {
#        "brand_name": "string",
#        "shipping_preference": "GET_FROM_FILE",
#        "locale": "string",
#        "return_url": "string",
#        "cancel_url": "string"
#      }
#    },
#    "trustly": {
#      "name": "string",
#      "country_code": "string",
#      "experience_context": {
#        "brand_name": "string",
#        "shipping_preference": "GET_FROM_FILE",
#        "locale": "string",
#        "return_url": "string",
#        "cancel_url": "string"
#      }
#    },
#    "venmo": {
#      "experience_context": {
#        "brand_name": "string",
#        "shipping_preference": "GET_FROM_FILE"
#      },
#      "vault_id": "string",
#      "email_address": "string",
#      "attributes": {
#        "customer": {
#          "id": "string"
#        },
#        "vault": {
#          "store_in_vault": "ON_SUCCESS",
#          "description": "string",
#          "usage_pattern": "string",
#          "usage_type": "string",
#          "customer_type": "CONSUMER",
#          "permit_multiple_payment_tokens": false
#        }
#      }
#    }
#  },
#  "application_context": {
#    "brand_name": "string",
#    "landing_page": "LOGIN",
#    "shipping_preference": "GET_FROM_FILE",
#    "user_action": "CONTINUE",
#    "return_url": "http://example.com",
#    "cancel_url": "http://example.com",
#    "locale": "string",
#    "payment_method": {
#      "standard_entry_class_code": "TEL",
#      "payee_preferred": "UNRESTRICTED"
#    },
#    "stored_payment_source": {
#      "payment_initiator": "CUSTOMER",
#      "payment_type": "ONE_TIME",
#      "usage": "FIRST",
#      "previous_network_transaction_reference": {
#        "id": "stringstr",
#        "date": "stri",
#        "network": "VISA"
#      }
#    }
#  }
# }
#
