import pandas as pd
import argparse

def preprocess(input_path, output_path):
    df = pd.read_csv(input_path)
    df.dropna(inplace=True)
    df.to_csv(output_path, index=False)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to input CSV")
    parser.add_argument("--output", required=True, help="Path to output CSV")
    args = parser.parse_args()
    preprocess(args.input, args.output)
