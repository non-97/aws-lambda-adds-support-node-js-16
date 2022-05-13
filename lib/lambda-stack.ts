import {
  Duration,
  Stack,
  StackProps,
  aws_iam as iam,
  aws_logs as logs,
  aws_lambda as lambda,
  aws_lambda_nodejs as nodejs,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new nodejs.NodejsFunction(this, "Node.js 16 Lambda Function", {
      entry: path.join(
        __dirname,
        "../src/lambda/handlers/node-js-16-handler.ts"
      ),
      runtime: lambda.Runtime.NODEJS_16_X,
      bundling: {
        minify: true,
        sourceMap: true,
        target: "node16.14",
        tsconfig: path.join(__dirname, "../src/lambda/tsconfig.json"),
        format: nodejs.OutputFormat.ESM,
      },
      architecture: lambda.Architecture.ARM_64,
      role: new iam.Role(this, "IAM Role", {
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole"
          ),
        ],
      }),
      logRetention: logs.RetentionDays.TWO_WEEKS,
      tracing: lambda.Tracing.ACTIVE,
      timeout: Duration.seconds(10),
    });
  }
}
