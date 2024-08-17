package com.beconnected.utilities;


import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Random;

@AllArgsConstructor
@Component
public class MatrixFactorization {

    private int numFeatures;
    private double learningRate;
    private double regularization;
    private double errorThreshold;

    public MatrixFactorization() {
        this.numFeatures = 10;
        this.learningRate = 0.002;
        this.regularization = 0.02;
        this.errorThreshold = 0.01;
    }

    public double[][] factorization(double[][] scoreMatrix, int numEpochs) {
        int numUsers = scoreMatrix.length;
        int numItems = scoreMatrix[0].length;

        double[][] userMatrix = new double[numUsers][numFeatures];
        double[][] itemMatrix = new double[numFeatures][numItems];

        Random rand = new Random();

        for (int i = 0; i < numUsers; i++) {
            for (int j = 0; j < numFeatures; j++) {
                userMatrix[i][j] = rand.nextDouble();
            }
        }
        for (int i = 0; i < numItems; i++) {
            for (int j = 0; j < numFeatures; j++) {
                itemMatrix[j][i] = rand.nextDouble();
            }
        }

        for (int epoch = 0; epoch < numEpochs; epoch++) {
            for (int i = 0; i < numUsers; i++) {
                for (int j = 0; j < numItems; j++) {
                    if (scoreMatrix[i][j] <= 0) continue;

                    double error = scoreMatrix[i][j] - dotProduct(userMatrix[i], itemMatrix, j);

                    for (int k = 0; k < numFeatures; k++) {
                        userMatrix[i][k] += learningRate * (2 * error * itemMatrix[k][j] - regularization * userMatrix[i][k]);
                        itemMatrix[k][j] += learningRate * (2 * error * userMatrix[i][k] - regularization * itemMatrix[k][j]);
                    }
                }
            }

            double error = computeError(userMatrix, itemMatrix, scoreMatrix);

            if (error > errorThreshold) break;
        }

        double[][] result = new double[numUsers][numItems];

        for (int i = 0; i < numUsers; i++) {
            for (int j = 0; j < numItems; j++) {
                result[i][j] = dotProduct(userMatrix[i], itemMatrix, j);
            }
        }

        return result;
    }

    private double computeError(double[][] userMatrix, double[][] itemMatrix, double[][] scoreMatrix) {
        int numUsers = scoreMatrix.length;
        int numItems = scoreMatrix[0].length;

        double error = 0;

        for (int i = 0; i < numUsers; i++) {
            for (int j = 0; j < numItems; j++) {
                if  (scoreMatrix[i][j] <= 0) continue;

                double scoreError = scoreMatrix[i][j] - dotProduct(userMatrix[i], itemMatrix, j);
                error += scoreError * scoreError;

                for (int k = 0; k < numFeatures; k++) {
                    error += (regularization / 2) * (userMatrix[i][k] * userMatrix[i][k] + itemMatrix[k][j] * itemMatrix[k][j]);
                }
            }
        }
        return error;
    }

    private double dotProduct(double[] row, double[][] matrix, int columnIndex) {
        double sum = 0.0;
        for (int i = 0; i < row.length; i++) {
            sum += row[i] * matrix[i][columnIndex];
        }
        return sum;
    }
}
