package org.web4.utils;

import org.web4.entity.Area;

import java.time.LocalDateTime;

public class AreaChecker {
    public static Area getAllRes(double x, double y, double r){
        final long startExec = System.nanoTime();

        boolean res = AreaChecker.getResult(x, y, r);

        final long endExec = System.nanoTime();
        final long executionTime = endExec - startExec;
        final LocalDateTime executedAt = LocalDateTime.now();

        Area area = new Area(x, y, r, res, executionTime, executedAt);

        return area;
    }
    public static boolean getResult(double x, double y, double r) {
        if (x <= 0 && y >= 0) {
            double newX = -r/2 + y;
            return x >= newX;
        } else if (x >= 0 && y >= 0) {
            if(x <= r && y <= r/2){
                return true;
            }
        } else if (x >= 0 && y <= 0) {
            return (x * x) + (y * y) <= ((r) * (r));
        }
        return false;
    }
}
