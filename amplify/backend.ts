import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.ts";
import { data } from "./data/resource.ts";
import { storage } from "./storage/resource.ts";
import { Stack } from "aws-cdk-lib";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

/**
 * NatureMama Heritage – Amplify Gen 2 backend.
 *
 * Pipeline resolver architecture for RAG:
 *   Step 1: fetchProducts.js → DynamoDB Product table (auto-created by Amplify)
 *   Step 2: chatHandler.js  → Bedrock HTTP data source (custom)
 *
 * The Product DynamoDB data source is automatically created by Amplify
 * when you define the Product model. We reference it via a.ref("Product")
 * in the schema. Only the Bedrock HTTP data source needs manual creation.
 */
const backend = defineBackend({ auth, data, storage });

// ── Bedrock HTTP Data Source (LLM inference) ──────────────────────────────

const dataStack = Stack.of(backend.data);
const region    = dataStack.region;

const bedrockEndpoint =
  "https://bedrock-runtime." + region + ".amazonaws.com";

const bedrockDS = backend.data.addHttpDataSource(
  "BedrockDataSource",
  bedrockEndpoint,
  {
    authorizationConfig: {
      signingRegion: region,
      signingServiceName: "bedrock",
    },
  }
);

// Grant AppSync permission to invoke Nova Pro
bedrockDS.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["bedrock:InvokeModel"],
    resources: [
      "arn:aws:bedrock:" + region + "::foundation-model/amazon.nova-pro-v1:0",
    ],
  })
);
